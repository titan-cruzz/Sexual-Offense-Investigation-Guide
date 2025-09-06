import React, { useState, useEffect } from 'react';

// Main App Component
const App = () => {
  const [view, setView] = useState('home');
  const [currentCase, setCurrentCase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [judgementAnalysis, setJudgementAnalysis] = useState(null);
  const [medicalReportContent, setMedicalReportContent] = useState(null);
  const [forensicReportContent, setForensicReportContent] = useState(null);

  // Simulated data and AI logic
  const mockSops = {
    'BNS 69': [
      'Record statement of victim under Section 164 Cr.P.C.',
      'Conduct medical examination of the victim as per SOP.',
      'Collect and preserve all physical and digital evidence.',
      'Interview key witnesses and record their statements.',
      'Prepare and submit the case diary.',
      'File the charge sheet within the stipulated timeframe.'
    ],
    'POCSO Act 3': [
      'Ensure the victim is provided with a safe environment.',
      'Record the victim\'s statement in the presence of a guardian or social worker.',
      'Obtain consent for medical examination from the victim or guardian.',
      'Inform the Special Juvenile Police Unit (SJPU) and Child Welfare Committee (CWC).',
      'Ensure the trial is conducted by a Special Court.',
      'Maintain the confidentiality of the victim\'s identity.'
    ],
    'IT Act 67B': [
      'Secure and seize all electronic devices involved.',
      'Prepare a detailed seizure memo with hash values.',
      'Send devices to the forensic lab for examination.',
      'Record statements from witnesses and the accused regarding digital evidence.',
      'Analyze digital trails and communication records.',
      'Include a cyber-forensic report in the charge sheet.'
    ],
  };

  const mockComplianceChecklist = {
    'medical_exam': { label: 'Medical Examination', required: true, isComplete: false },
    'victim_statement': { label: 'Victim Statement (Sec 183 BNSS)', required: true, isComplete: false },
    'digital_evidence': { label: 'Digital Evidence Collection', required: false, isComplete: false },
    'witness_statements': { label: 'Witness Statements', required: true, isComplete: false },
    'forensic_report': { label: 'Forensic Report', required: false, isComplete: false },
  };

  const mockJudgements = {
    'admissibility': `
      <p class="font-bold text-lg mb-2 text-rose-300">Analysis of Admissibility of Evidence</p>
      <p class="text-gray-300">The uploaded judgment highlights that a victim's testimony under Section 183 BNSS, if consistent and credible, can be the sole basis for conviction. It emphasizes the importance of promptly recorded statements and a thorough medical examination to corroborate the victim's account. Any delay must be adequately explained.</p>
      <p class="font-bold text-lg mt-4 mb-2 text-rose-300">Investigation Pitfalls</p>
      <p class="text-gray-300">The court noted a major pitfall was the investigator's failure to collect call detail records (CDRs) of the accused, despite the victim mentioning receiving threatening calls. This led to a lack of crucial corroborative evidence. The judgment advises to proactively collect all relevant digital evidence, even if not explicitly mentioned in the initial complaint.</p>
      <p class="font-bold text-lg mt-4 mb-2 text-rose-300">Judicial Expectations</p>
      <p class="text-gray-300">The judiciary expects a meticulously documented investigation. The charge sheet should not merely reproduce the FIR but provide a detailed chronological account of each step taken, with clear references to collected evidence and statements. Proper chain of custody for all physical evidence is paramount to avoid its admissibility being challenged during trial.</p>
    `,
    'conviction_rate': `
      <p class="font-bold text-lg mb-2 text-rose-300">Analysis of Conviction Factors</p>
      <p class="text-gray-300">This judgment underscores that conviction rates are directly tied to the quality of the investigation. Key factors leading to conviction in this case were:</p>
      <ul class="list-disc list-inside mt-2 text-gray-300">
        <li>Timely medical examination that corroborated the victim's statement.</li>
        <li>Uninterrupted and prompt recording of the victim's statement without external influence.</li>
        <li>Successful collection and analysis of digital evidence (WhatsApp chats and social media posts).</li>
        <li>A well-organized and legally compliant charge sheet.</li>
      </ul>
      <p class="font-bold text-lg mt-4 mb-2 text-rose-300">Suggested Best Practices</p>
      <p class="text-gray-300">The court highlighted the best practices that led to a swift conviction:</p>
      <ul class="list-disc list-inside mt-2 text-gray-300">
        <li>The IO promptly secured the crime scene and prevented contamination.</li>
        <li>Photographic and video evidence of the crime scene was meticulously documented.</li>
        <li>A 'zero FIR' was registered immediately and transferred to the appropriate jurisdiction without delay.</li>
        <li>The IO ensured the victim was provided with psychological support, which helped in gaining her trust and cooperation.</li>
      </ul>
    `,
    'procedural_pitfalls': `
      <p class="font-bold text-lg mb-2 text-rose-300">Analysis of Procedural Lapses</p>
      <p class="text-gray-300">This judgment highlights several key procedural failures that led to the acquittal of the accused. The court noted that a lack of proper documentation and failure to follow established protocols significantly weakened the prosecution's case. The investigator's failure to obtain a signed consent form for a forensic examination was a critical omission.</p>
      <p class="font-bold text-lg mt-4 mb-2 text-rose-300">Critical Alerts for Future Investigations</p>
      <ul class="list-disc list-inside mt-2 text-gray-300">
        <li>The medical report was submitted as an unsigned photocopy, which the court deemed inadmissible. Ensure the original signed report is always included in the charge sheet.</li>
        <li>The statement of a key witness was recorded a week after the incident, casting doubt on its credibility. Ensure all witness statements are recorded as soon as possible after the event.</li>
        <li>The investigator failed to document the chain of custody for a seized mobile phone, leading to its exclusion from evidence. Maintain a clear and unbroken chain of custody for all physical evidence.</li>
      </ul>
    `,
  };

  const generateMockDocument = (type) => {
    const { firNumber, victimName, accusedName, dateOfOffence, sections, station } = currentCase;
    const date = new Date().toLocaleDateString('en-IN');
    const time = new Date().toLocaleTimeString('en-IN');
    let content = '';

    switch (type) {
      case 'case-diary':
        content = `
          <p class="text-xl font-bold text-white mb-4">CASE DIARY</p>
          <div class="space-y-2 text-sm text-gray-300">
            <p><span class="font-semibold text-white">FIR No.:</span> ${firNumber}</p>
            <p><span class="font-semibold text-white">Police Station:</span> ${station}</p>
            <p><span class="font-semibold text-white">Case Date:</span> ${date}</p>
            <p><span class="font-semibold text-white">Case Time:</span> ${time}</p>
            <p><span class="font-semibold text-white">Sections:</span> ${sections.join(', ')}</p>
            <p><span class="font-semibold text-white">Summary of Investigation Steps:</span></p>
            <ul class="list-disc list-inside ml-4 mt-2">
              <li>Visited the crime scene and collected preliminary evidence.</li>
              <li>Recorded statement of victim, ${victimName}, as per legal protocols.</li>
              ${medicalReportContent ? `<li>Medical examination report submitted and analyzed. Key findings: ${medicalReportContent.analysis.summary}</li>` : '<li>Sent the victim for a medical examination.</li>'}
              <li>Arrested the accused, ${accusedName}, from his residence.</li>
              <li>Seized the accused's electronic devices and sent them for forensic analysis.</li>
            </ul>
            <p class="mt-4"><span class="font-semibold text-white">IO Name:</span> [IO Name]</p>
            <p><span class="font-semibold text-white">Rank:</span> [Rank]</p>
          </div>
        `;
        break;
      case 'charge-sheet':
        content = `
          <p class="text-xl font-bold text-white mb-4">MODEL CHARGE SHEET</p>
          <div class="space-y-2 text-sm text-gray-300">
            <p><span class="font-semibold text-white">Case Name:</span> State of India vs. ${accusedName}</p>
            <p><span class="font-semibold text-white">FIR No.:</span> ${firNumber}</p>
            <p><span class="font-semibold text-white">Offence Date:</span> ${dateOfOffence}</p>
            <p><span class="font-semibold text-white">Applicable Sections:</span> ${sections.join(', ')}</p>
            <p class="mt-4"><span class="font-semibold text-white">Brief Facts of the Case:</span></p>
            <p class="mt-2 text-gray-400">On ${dateOfOffence}, the accused, ${accusedName}, committed a sexual offense against the victim, ${victimName}. The investigation revealed compelling evidence including:</p>
            <ul class="list-disc list-inside ml-4 mt-2">
              <li>Testimony of the victim under Section 183 BNSS.</li>
              ${medicalReportContent ? `<li>Medical report corroborating the victim's account. Key details: ${medicalReportContent.analysis.summary}.</li>` : '<li>Medical report corroborating the victim\'s account.</li>'}
              <li>Call detail records and digital communication logs between the accused and victim.</li>
              <li>Forensic report confirming the presence of digital evidence.</li>
            </ul>
            <p class="mt-4"><span class="font-semibold text-white">List of Witnesses:</span> 1. ${victimName} (Victim) 2. Dr. [Medical Officer Name] 3. [IO Name] (IO)</p>
            <p class="mt-4"><span class="font-semibold text-white">Evidence Submitted:</span> 1. Medical Report 2. Forensic Report 3. Seizure Memo 4. Witness Statements</p>
          </div>
        `;
        break;
      case 'final-report':
        content = `
          <p class="text-xl font-bold text-white mb-4">FINAL REPORT</p>
          <div class="space-y-2 text-sm text-gray-300">
            <p><span class="font-semibold text-white">Case Reference:</span> FIR No. ${firNumber}, Police Station ${station}</p>
            <p><span class="font-semibold text-white">Date:</span> ${date}</p>
            <p class="mt-4"><span class="font-semibold text-white">Summary:</span></p>
            <p class="mt-2 text-gray-400">The investigation into the case has been concluded. Based on the lack of sufficient corroborative evidence and inconsistent statements from witnesses, this report recommends closing the case due to insufficient evidence. All evidence collected has been properly documented and will be retained as per procedure.</p>
            <p class="mt-4"><span class="font-semibold text-white">IO Name:</span> [IO Name]</p>
            <p><span class="font-semibold text-white">Rank:</span> [Rank]</p>
          </div>
        `;
        break;
      default:
        content = 'Select a document type to generate a report.';
    }

    const documentText = `
      <div class="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto my-8 font-mono">
        ${content}
      </div>
    `;

    // Create a new window to display the generated document.
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Generated Document</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              background-color: #1a202c;
              color: #f3f4f6;
              padding: 2rem;
            }
          </style>
        </head>
        <body>
          ${documentText}
        </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      console.error('Failed to open new window for document generation.');
    }
  };

  const handleNewCase = (event) => {
    event.preventDefault();
    setLoading(true);
    const form = event.target;
    const firNumber = form.firNumber.value;
    const sections = form.sections.value.split(',').map(s => s.trim().toUpperCase());
    const victimName = form.victimName.value;
    const accusedName = form.accusedName.value;
    const dateOfOffence = form.dateOfOffence.value;
    const station = form.station.value;

    const relevantSops = sections.flatMap(s => mockSops[s] || []);
    const complianceChecks = JSON.parse(JSON.stringify(mockComplianceChecklist));
    sections.forEach(s => {
      if (s.includes('BNS 69')) {
        complianceChecks.victim_statement.required = true;
      }
      if (s.includes('IT ACT')) {
        complianceChecks.digital_evidence.required = true;
      }
    });

    const newCaseData = {
      firNumber,
      sections,
      victimName,
      accusedName,
      dateOfOffence,
      station,
      investigationSteps: relevantSops,
      complianceChecklist: complianceChecks,
    };

    setTimeout(() => {
      setCurrentCase(newCaseData);
      setView('case');
      setLoading(false);
      setMedicalReportContent(null);
      setForensicReportContent(null);
    }, 1000);
  };
  
  const handleMedicalReportUpload = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        // Mock AI analysis of the report
        const reportAnalysis = {
          summary: 'No physical injuries detected, but psychological distress was noted. The report recommends focusing on psychological assessment and legal support.',
          warnings: []
        };
        const reportDate = new Date('2025-09-05');
        const offenseDate = new Date(currentCase.dateOfOffence);
        const diffInDays = Math.floor((reportDate - offenseDate) / (1000 * 60 * 60 * 24));
        if (diffInDays > 2) {
          reportAnalysis.warnings.push(`Warning: A ${diffInDays}-day delay exists between the offense and the medical examination. Please document the reason for the delay in the case diary.`);
        }
        if (fileContent.includes('Signature: ______________________')) {
          reportAnalysis.warnings.push('Warning: The doctor\'s signature is missing. A valid, signed copy is required for legal proceedings.');
        }

        const updatedChecklist = { ...currentCase.complianceChecklist, 'medical_exam': { ...currentCase.complianceChecklist.medical_exam, isComplete: true } };
        setCurrentCase({ ...currentCase, complianceChecklist: updatedChecklist });
        setMedicalReportContent({ content: fileContent, analysis: reportAnalysis });
        setLoading(false);
      };
      reader.readAsText(file);
    }
  };

  const handleForensicReportUpload = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        // Mock AI analysis of the forensic report
        const reportAnalysis = {
          summary: 'Forensic analysis of the digital devices completed. The report confirms the presence of relevant data, including communication logs.',
          warnings: []
        };
        if (fileContent.includes('no usable DNA')) {
          reportAnalysis.warnings.push('Warning: The report indicates no usable DNA evidence was found. Focus on strengthening the digital and testimonial evidence.');
        }
        if (fileContent.includes('incomplete chain of custody')) {
          reportAnalysis.warnings.push('Critical Alert: The report mentions an incomplete chain of custody. This evidence may be inadmissible in court. Document all steps taken to secure the evidence immediately.');
        }
        if (fileContent.includes('devices wiped')) {
          reportAnalysis.warnings.push('Critical Alert: The report states the devices were wiped. This suggests an attempt to destroy evidence and should be highlighted in the charge sheet.');
        }

        const updatedChecklist = { ...currentCase.complianceChecklist, 'forensic_report': { ...currentCase.complianceChecklist.forensic_report, isComplete: true } };
        setCurrentCase({ ...currentCase, complianceChecklist: updatedChecklist });
        setForensicReportContent({ content: fileContent, analysis: reportAnalysis });
        setLoading(false);
      };
      reader.readAsText(file);
    }
  };

  const handleJudgementUpload = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        // Mock analysis based on file content.
        let analysisKey = 'admissibility'; // default
        if (fileContent.includes('conviction')) {
          analysisKey = 'conviction_rate';
        } else if (fileContent.includes('procedural')) {
          analysisKey = 'procedural_pitfalls';
        }
        setJudgementAnalysis(mockJudgements[analysisKey]);
        setLoading(false);
      };
      reader.readAsText(file);
    }
  };

  // UI Components
  const HomeView = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 min-h-screen text-white">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-rose-400">AI-Powered Investigation Guide</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          A specialized digital assistant to strengthen sexual offence investigations by ensuring legal compliance, integrating judicial guidance, and improving conviction rates.
        </p>
        <button
          onClick={() => setView('newCaseForm')}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 transform hover:scale-105 shadow-lg"
        >
          Start a New Case
        </button>
      </div>
    </div>
  );

  const NewCaseFormView = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">New Sexual Offence Case</h2>
        <form onSubmit={handleNewCase} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="firNumber" className="block text-sm font-medium text-gray-300">FIR Number</label>
              <input type="text" id="firNumber" name="firNumber" required className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-rose-500 focus:border-rose-500" />
            </div>
            <div>
              <label htmlFor="station" className="block text-sm font-medium text-gray-300">Police Station</label>
              <input type="text" id="station" name="station" required className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-rose-500 focus:border-rose-500" />
            </div>
            <div>
              <label htmlFor="victimName" className="block text-sm font-medium text-gray-300">Victim's Name</label>
              <input type="text" id="victimName" name="victimName" required className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-rose-500 focus:border-rose-500" />
            </div>
            <div>
              <label htmlFor="accusedName" className="block text-sm font-medium text-gray-300">Accused's Name</label>
              <input type="text" id="accusedName" name="accusedName" required className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-rose-500 focus:border-rose-500" />
            </div>
            <div>
              <label htmlFor="dateOfOffence" className="block text-sm font-medium text-gray-300">Date of Offence</label>
              <input type="date" id="dateOfOffence" name="dateOfOffence" required className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-rose-500 focus:border-rose-500" />
            </div>
            <div>
              <label htmlFor="sections" className="block text-sm font-medium text-gray-300">Sections of Law (comma-separated, e.g., BNS 69, POCSO Act 3)</label>
              <input type="text" id="sections" name="sections" required className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-rose-500 focus:border-rose-500" placeholder="e.g. BNS 69, POCSO Act 3, IT Act 67B" />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Investigation Guide'}
          </button>
          <button
            type="button"
            onClick={() => setView('home')}
            className="w-full text-center py-2 text-sm text-gray-400 hover:text-white transition-colors duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );

  const CaseView = () => (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex items-center mb-6">
        <button onClick={() => setView('home')} className="flex items-center text-gray-400 hover:text-rose-400 transition-colors duration-200">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Home
        </button>
      </div>

      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2">Case Details</h2>
        <p className="text-lg text-rose-400 mb-6">FIR No. {currentCase.firNumber}</p>
        <div className="grid md:grid-cols-2 gap-8">

          {/* AI-Generated Investigation Steps */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">AI-Powered Investigation Steps</h3>
            <ul className="space-y-3">
              {currentCase.investigationSteps.length > 0 ? (
                currentCase.investigationSteps.map((step, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <svg className="flex-shrink-0 w-6 h-6 text-green-400 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span>{step}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No specific steps found for the given sections. Refer to general SOPs.</p>
              )}
            </ul>
          </div>

          {/* Compliance Checklist */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Legal Compliance Checklist</h3>
            <ul className="space-y-3">
              {Object.keys(currentCase.complianceChecklist).map(key => {
                const item = currentCase.complianceChecklist[key];
                const isRequired = item.required;
                const isComplete = item.isComplete;
                const iconClass = isComplete ? 'text-green-400' : (isRequired ? 'text-red-400' : 'text-yellow-400');
                return (
                  <li key={key} className="flex items-center text-gray-300">
                    <svg className={`w-6 h-6 mr-3 ${iconClass}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      {isComplete ? (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                      )}
                    </svg>
                    <span>{item.label} {isRequired && <span className="text-red-400 font-semibold">(Mandatory)</span>}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-xs text-gray-400">
              <span className="text-green-400">•</span> Complete, <span className="text-red-400">•</span> Required, <span className="text-yellow-400">•</span> Recommended.
            </p>
          </div>
        </div>

        {/* AI-powered Features */}
        <div className="mt-8 space-y-8">

          {/* Medical Report Submission */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-semibold mb-4 text-white">Medical Report Submission</h3>
            <p className="text-gray-400 mb-4">Upload the medical examination report for AI analysis.</p>
            <input type="file" onChange={handleMedicalReportUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
            {loading && <p className="mt-4 text-rose-400">Analyzing report...</p>}
            {medicalReportContent && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <p className="font-bold text-lg mb-2 text-rose-300">AI Analysis of Medical Report</p>
                <p className="text-gray-300">{medicalReportContent.analysis.summary}</p>
                {medicalReportContent.analysis.warnings.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {medicalReportContent.analysis.warnings.map((warning, index) => (
                      <p key={index} className="text-red-400 font-semibold">{warning}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Forensic Report Submission */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-semibold mb-4 text-white">Forensic Report Analysis</h3>
            <p className="text-gray-400 mb-4">Upload a forensic report (.txt file) for AI analysis.</p>
            <input type="file" onChange={handleForensicReportUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
            {loading && <p className="mt-4 text-rose-400">Analyzing report...</p>}
            {forensicReportContent && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <p className="font-bold text-lg mb-2 text-rose-300">AI Analysis of Forensic Report</p>
                <p className="text-gray-300">{forensicReportContent.analysis.summary}</p>
                {forensicReportContent.analysis.warnings.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {forensicReportContent.analysis.warnings.map((warning, index) => (
                      <p key={index} className="text-red-400 font-semibold">{warning}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Judgment Analysis */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-semibold mb-4 text-white">Judicial Guidance Assistant</h3>
            <p className="text-gray-400 mb-4">Upload a court judgment (.txt file) for analysis.</p>
            <input type="file" onChange={handleJudgementUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
            {loading && <p className="mt-4 text-rose-400">Analyzing judgment...</p>}
            {judgementAnalysis && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: judgementAnalysis }} />
              </div>
            )}
          </div>

          {/* Document Generation */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-semibold mb-4 text-white">Document Generation</h3>
            <p className="text-gray-400 mb-4">Auto-generate standardized documents based on case details.</p>
            <div className="flex space-x-4">
              <button
                onClick={() => generateMockDocument('case-diary')}
                className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors duration-300"
              >
                Case Diary
              </button>
              <button
                onClick={() => generateMockDocument('charge-sheet')}
                className="flex-1 py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors duration-300"
              >
                Charge Sheet
              </button>
              <button
                onClick={() => generateMockDocument('final-report')}
                className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors duration-300"
              >
                Final Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomeView />;
      case 'newCaseForm':
        return <NewCaseFormView />;
      case 'case':
        return <CaseView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans">
      <style>{`
        body { font-family: 'Inter', sans-serif; background-color: #111827; }
        ::-webkit-file-upload-button {
          cursor: pointer;
        }
      `}</style>
      {renderView()}
    </div>
  );
};

export default App;
