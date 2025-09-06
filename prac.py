from fpdf import FPDF
import qrcode
from datetime import datetime
import random

def random_vitals():
    return {
        "BP": f"{random.randint(110,130)}/{random.randint(70,85)} mmHg",
        "Pulse": f"{random.randint(70,90)} bpm",
        "Resp": f"{random.randint(14,18)}/min",
        "Temp": f"{round(random.uniform(36.5,37.5),1)}°C"
    }

def random_findings():
    injuries = [
        "No visible injuries",
        "Minor bruises on left arm",
        "Redness on neck and shoulder",
        "Small abrasion on right hand",
        "Tenderness on left forearm",
        "Bruises on thigh and knee",
        "Scratch marks on back"
    ]
    psychological = [
        "Anxious and distressed",
        "Calm but shaken",
        "Highly anxious",
        "Mildly upset",
        "Fearful, requires counseling"
    ]
    genital = [
        "Normal, no evidence of penetration or trauma",
        "Minor abrasions, no penetration",
        "Signs of trauma, inconclusive for penetration",
        "Evidence of forced contact, trauma present"
    ]
    return random.choice(injuries), random.choice(psychological), random.choice(genital)

def generate_demo_report(case_id, patient_name, age, filename):
    # QR code
    qr_data = f"CaseID:{case_id} | Verified:Demo"
    qr = qrcode.QRCode(box_size=2, border=1)
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    qr_path = f"{filename}_qr.png"
    img.save(qr_path)

    # PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "CITY GENERAL HOSPITAL", ln=True, align="C")
    pdf.set_font("Helvetica", "", 12)
    pdf.cell(0, 8, "Department of Forensic Medicine", ln=True, align="C")
    pdf.ln(5)
    pdf.cell(0, 8, "Medical Examination Report", ln=True, align="C")
    pdf.ln(5)

    # Patient & case details
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "Patient Details:", ln=True)
    pdf.set_font("Helvetica", "", 12)
    pdf.multi_cell(0, 6,
f"""
Name: {patient_name}
Age: {age} years
Gender: Female
Address: [Redacted]
Case ID: {case_id}
Reporting Officer: Inspector A. Nandan
Date of Examination: {datetime.today().strftime('%d-%b-%Y')}
""")
    pdf.ln(2)

    # Reason & history
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "Reason for Examination:", ln=True)
    pdf.set_font("Helvetica", "", 12)
    pdf.multi_cell(0, 6,"Medical examination requested following an alleged sexual harassment incident.")
    pdf.ln(2)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "History Provided:", ln=True)
    pdf.set_font("Helvetica", "", 12)
    pdf.multi_cell(0, 6,
f"- Patient reports unwanted physical contact and verbal harassment.\n"
f"- No prior medical conditions reported.\n"
f"- Time of incident: {random.randint(9,20)}:{random.randint(0,59):02d} hrs.\n")
    pdf.ln(2)

    # Examination findings
    vitals = random_vitals()
    injury, psych, genital_exam = random_findings()
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "Examination Findings:", ln=True)
    pdf.set_font("Helvetica", "", 12)
    pdf.multi_cell(0,6,
f"""General Appearance: Conscious, oriented, no apparent distress.
Vital Signs:
  - Blood Pressure: {vitals['BP']}
  - Pulse: {vitals['Pulse']}
  - Respiratory Rate: {vitals['Resp']}
  - Temperature: {vitals['Temp']}
Physical Examination:
  - Skin: {injury}.
  - Limbs: {injury}.
  - Genital Examination: {genital_exam}.
  - Psychological Observation: {psych}.
""")
    pdf.ln(2)

    # Investigations
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0,8,"Investigations Recommended:",ln=True)
    pdf.set_font("Helvetica","",12)
    pdf.multi_cell(0,6,"- Psychological assessment for trauma.\n- Documentation of statements for legal proceedings.\n")
    pdf.ln(2)

    # Summary
    pdf.set_font("Helvetica","B",12)
    pdf.cell(0,8,"Summary / Conclusion:",ln=True)
    pdf.set_font("Helvetica","",12)
    pdf.multi_cell(0,6,"- No physical injuries detected.\n- Psychological distress noted.\n- Patient advised to follow up for counseling and legal support.\n- Report submitted for investigative purposes.\n")
    pdf.ln(5)

    # Signature & QR
    pdf.set_font("Helvetica","",12)
    pdf.cell(0,8,"Doctor / Examiner: Dr. R. Sharma, MD (Forensic Medicine)",ln=True)
    pdf.cell(0,8,"Signature: ______________________",ln=True)
    pdf.image(qr_path, x=170, y=pdf.get_y()-20, w=25)
    pdf.ln(5)
    pdf.cell(0,8,f"Date: {datetime.today().strftime('%d-%b-%Y')}",ln=True)

    pdf.output(filename)
    print(f"✅ Generated {filename}")

# Generate 5 unique reports with varied genital examination
names = ["Ananya S.", "Ritika P.", "Meera K.", "Divya R.", "Sneha T."]
ages = [22,24,23,21,25]
for i in range(5):
    case_id = f"SHC-2025-09-0{i+1}"
    filename = f"demo_medical_report_{i+1}.pdf"
    generate_demo_report(case_id, names[i], ages[i], filename)
