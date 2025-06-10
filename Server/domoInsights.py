from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import pandas as pd
import os
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
CORS(app)
client = OpenAI(api_key=os.getenv("open_ai_key"))

EXCEL_FOLDER = "data"  # Make sure this folder exists and contains your data files

@app.route('/api/get-insights', methods=['POST'])
def get_insights():
    try:
        data = request.get_json()
        print("Received request data:", data)

        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        user_prompt = data.get('prompt', '').strip()
        excel_file = data.get('excelFile', '').strip()

        # Validate filename
        if not excel_file or '..' in excel_file or excel_file.startswith('/'):
            return jsonify({'error': 'Invalid or missing file name'}), 400

        file_path = os.path.join(EXCEL_FOLDER, excel_file)
        print("Resolved file path:", file_path)

        if not os.path.exists(file_path):
            return jsonify({'error': f'File not found: {file_path}'}), 404

        # Load Excel or CSV based on file extension
        if excel_file.lower().endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        # Clean the data
        clean_df = df.dropna(how="all").replace(0, pd.NA).dropna(how="all", axis=1)
        data_string = clean_df.head(50).to_string(index=False)

        # Prepare prompt
        final_prompt = f"{user_prompt}\n\nHere is the dataset:\n{data_string}"
        print("Final prompt prepared for OpenAI.")

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
        print("Received insight from OpenAI.")
        return jsonify({"insight": insight})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
