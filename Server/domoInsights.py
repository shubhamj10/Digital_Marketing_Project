import pandas as pd
import os
import sys
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("open_ai_key"))
EXCEL_FOLDER = "data"  # Ensure this folder exists and contains your data files

def get_insights(prompt, excel_file):
    try:
        # Validate filename
        if not excel_file or '..' in excel_file or excel_file.startswith('/'):
            return {"error": "Invalid or missing file name"}

        file_path = os.path.join(EXCEL_FOLDER, excel_file)

        if not os.path.exists(file_path):
            return {"error": f"File not found: {file_path}"}

        # Load Excel or CSV based on file extension
        if excel_file.lower().endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        # Clean the data
        clean_df = df.dropna(how="all").replace(0, pd.NA).dropna(how="all", axis=1)
        data_string = clean_df.head(50).to_string(index=False)

        # Prepare prompt
        final_prompt = f"{prompt}\n\nHere is the dataset:\n{data_string}"

        # Send to OpenAI
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert data analyst."},
                {"role": "user", "content": final_prompt},
            ],
            temperature=0.5
        )

        insight = response.choices[0].message.content
        return {"insight": insight}

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python domoInsights.py <prompt> <excel_file>"}))
        sys.exit(1)

    prompt_arg = sys.argv[1]
    file_arg = sys.argv[2]

    result = get_insights(prompt_arg, file_arg)
    print(json.dumps(result))
