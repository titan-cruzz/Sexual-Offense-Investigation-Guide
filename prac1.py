from fpdf import FPDF
import qrcode
from datetime import datetime
import random
import os

# Folders
medical_folder = "paired_medical_reports"
forensic_folder = "paired_forensic_reports"
os.makedirs(medical_folder, exist_ok=True)
os.makedirs(forensic_folder, exist_ok=True)

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

def random_lab_results():
    blood = random.choice(["Normal", "Mild stress markers"])
    urine = random.choice(["Normal", "Traces of stress hormones"])
    dna = random.choice(["Collected", "Insufficient sample"])
    sti = random.choice(["Negative", "Inconclusive", "Positive"])  # STI can now be positive
    toxicology = random.choice(["Negative", "No abnormal findings"])
    return blood, urine, dna, sti, toxicology

def generate_medical_report(case_id, patient_name, age, filename):
    qr_data = f"CaseID:{case_id} | Verified:Demo"
    qr = qrcode.QRCode(box_size=2, border=1)
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    qr_path = f"{filename}_qr.png"
    img.save(qr_path)

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

    pdf.set_font("Helvetica","B",12)
    pdf.cell(0,8,"Summary / Conclusion:",ln=True)
    pdf.set_font("Helvetica","",12)
    pdf.multi_cell(0,6,"- No physical injuries detected.\n- Psychological distress noted.\n- Patient advised to follow up for counseling and legal support.\n- Report submitted for investigative purposes.\n")
    pdf.ln(5)

    pdf.set_font("Helvetica","",12)
    pdf.cell(0,8,"Doctor / Examiner: Dr. R. Sharma, MD (Forensic Medicine)",ln=True)
    pdf.cell(0,8,"Signature: ______________________",ln=True)
    pdf.image(qr_path, x=170, y=pdf.get_y()-20, w=25)
    pdf.ln(5)
    pdf.cell(0,8,f"Date: {datetime.today().strftime('%d-%b-%Y')}",ln=True)

    pdf.output(os.path.join(medical_folder, filename))
    print(f"✅ Generated Medical Report: {filename}")

def generate_forensic_report(case_id, patient_name, age, filename):
    qr_data = f"CaseID:{case_id} | Verified:Demo"
    qr = qrcode.QRCode(box_size=2, border=1)
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    qr_path = f"{filename}_qr.png"
    img.save(qr_path)

    blood, urine, dna, sti, toxicology = random_lab_results()
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "CITY GENERAL HOSPITAL", ln=True, align="C")
    pdf.set_font("Helvetica", "", 12)
    pdf.cell(0, 8, "Department of Forensic Medicine", ln=True, align="C")
    pdf.ln(5)
    pdf.cell(0, 8, "Forensic Lab Test Report", ln=True, align="C")
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0,8,"Patient Details:",ln=True)
    pdf.set_font("Helvetica","",12)
    pdf.multi_cell(0,6,
f"""
Name: {patient_name}
Age: {age} years
Gender: Female
Case ID: {case_id}
Date of Report: {datetime.today().strftime('%d-%b-%Y')}
""")
    pdf.ln(2)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0,8,"Lab Test Results:",ln=True)
    pdf.set_font("Helvetica","",12)
    pdf.multi_cell(0,6,
f"- Blood Test: {blood}\n"
f"- Urine Test: {urine}\n"
f"- DNA Swab: {dna}\n"
f"- STI Test: {sti}\n"
f"- Toxicology: {toxicology}\n")
    pdf.ln(2)

    pdf.set_font("Helvetica","",12)
    pdf.cell(0,8,"Forensic Officer: Dr. R. Sharma, MD (Forensic Medicine)",ln=True)
    pdf.cell(0,8,"Signature: ______________________",ln=True)
    pdf.image(qr_path, x=170, y=pdf.get_y()-20, w=25)
    pdf.ln(5)
    pdf.cell(0,8,f"Date: {datetime.today().strftime('%d-%b-%Y')}",ln=True)

    pdf.output(os.path.join(forensic_folder, filename))
    print(f"✅ Generated Forensic Report: {filename}")

# Generate paired reports
names = ["Ananya S.", "Ritika P.", "Meera K.", "Divya R.", "Sneha T."]
ages = [22,24,23,21,25]

for i in range(5):
    case_id = f"SHC-2025-09-0{i+1}"
    medical_filename = f"medical_report_{i+1}.pdf"
    forensic_filename = f"forensic_report_{i+1}.pdf"

    generate_medical_report(case_id, names[i], ages[i], medical_filename)
    generate_forensic_report(case_id, names[i], ages[i], forensic_filename)
