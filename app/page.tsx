'use client';

import { useState } from 'react';

interface TDLTemplate {
  name: string;
  description: string;
  code: string;
}

const templates: TDLTemplate[] = [
  {
    name: 'Custom Report',
    description: 'Create a basic custom report',
    code: `[Report: My Custom Report]
    Use : DSP Report
    Form : My Custom Form

[Form: My Custom Form]
    Use : DSP Form
    Parts : My Custom Part

[Part: My Custom Part]
    Line : My Title Line

[Line: My Title Line]
    Use : Title Line
    Set : 1 : "My Custom Report"`
  },
  {
    name: 'Custom Menu',
    description: 'Add a custom menu item',
    code: `[Menu: Gateway of Tally]
    Add : Item : "My Custom Menu" : Call : My Custom Report

[Report: My Custom Report]
    Use : DSP Report
    Form : My Form`
  },
  {
    name: 'Custom Field',
    description: 'Add a custom field to a voucher',
    code: `[Field: My Custom Field]
    Use : Name Field
    Storage : My Custom Field

[#Object: Voucher]
    My Custom Field : String : 100`
  },
  {
    name: 'Custom Button',
    description: 'Add a custom button',
    code: `[Button: My Button]
    Key : F12 : My Button
    Action : Display : My Custom Report

[Report: My Custom Report]
    Use : DSP Report
    Form : My Form`
  },
  {
    name: 'Field Validation',
    description: 'Add validation to a field',
    code: `[Field: Amount Field]
    Use : Amount Field
    Validate : ##Amount > 0
    Error : "Amount must be greater than zero"`
  },
  {
    name: 'Collection Object',
    description: 'Create a custom collection',
    code: `[Collection: My Collection]
    Type : Ledger
    Filter : MyFilter

[System: Formula]
    MyFilter : $Name = "Cash"`
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('builder');
  const [tdlCode, setTdlCode] = useState('');

  const [formData, setFormData] = useState({
    objectType: 'Report',
    objectName: '',
    useClause: '',
    attributes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateTDL = () => {
    const { objectType, objectName, useClause, attributes } = formData;

    if (!objectName) {
      alert('Please enter an object name');
      return;
    }

    let code = `[${objectType}: ${objectName}]\n`;

    if (useClause) {
      code += `    Use : ${useClause}\n`;
    }

    if (attributes) {
      const lines = attributes.split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          code += `    ${line.trim()}\n`;
        }
      });
    }

    setTdlCode(code);
    setActiveTab('code');
  };

  const loadTemplate = (template: TDLTemplate) => {
    setTdlCode(template.code);
    setActiveTab('code');
  };

  const downloadTDL = () => {
    if (!tdlCode) {
      alert('No TDL code to download');
      return;
    }

    const blob = new Blob([tdlCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom.tdl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!tdlCode) {
      alert('No TDL code to copy');
      return;
    }
    navigator.clipboard.writeText(tdlCode);
    alert('TDL code copied to clipboard!');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🧮 Tally Prime TDL Editor</h1>
        <p>Create and customize Tally Definition Language (TDL) code for Tally Prime</p>
      </div>

      <div className="main-content">
        <div className="panel">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'builder' ? 'active' : ''}`}
              onClick={() => setActiveTab('builder')}
            >
              Builder
            </button>
            <button
              className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </button>
            <button
              className={`tab ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              Generated Code
            </button>
          </div>

          {activeTab === 'builder' && (
            <div>
              <div className="form-group">
                <label>Object Type</label>
                <select name="objectType" value={formData.objectType} onChange={handleInputChange}>
                  <option value="Report">Report</option>
                  <option value="Form">Form</option>
                  <option value="Part">Part</option>
                  <option value="Line">Line</option>
                  <option value="Field">Field</option>
                  <option value="Collection">Collection</option>
                  <option value="Menu">Menu</option>
                  <option value="Button">Button</option>
                  <option value="Function">Function</option>
                  <option value="Object">Object</option>
                </select>
              </div>

              <div className="form-group">
                <label>Object Name</label>
                <input
                  type="text"
                  name="objectName"
                  value={formData.objectName}
                  onChange={handleInputChange}
                  placeholder="e.g., My Custom Report"
                />
              </div>

              <div className="form-group">
                <label>Use Clause (Optional)</label>
                <input
                  type="text"
                  name="useClause"
                  value={formData.useClause}
                  onChange={handleInputChange}
                  placeholder="e.g., DSP Report"
                />
              </div>

              <div className="form-group">
                <label>Attributes (One per line)</label>
                <textarea
                  name="attributes"
                  value={formData.attributes}
                  onChange={handleInputChange}
                  placeholder="e.g.,&#10;Form : My Form&#10;Title : My Title"
                  rows={8}
                />
              </div>

              <button className="btn" onClick={generateTDL}>
                Generate TDL Code
              </button>
            </div>
          )}

          {activeTab === 'templates' && (
            <div>
              <p style={{ marginBottom: '20px', color: '#666' }}>
                Click on a template to load it in the code editor
              </p>
              <div className="templates">
                {templates.map((template, index) => (
                  <div
                    key={index}
                    className="template-card"
                    onClick={() => loadTemplate(template)}
                  >
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div>
              <div className="code-editor">
                {tdlCode || '// Your generated TDL code will appear here\n// Use the Builder tab to create TDL code or select a template'}
              </div>
              <div className="actions">
                <button className="btn" onClick={downloadTDL} disabled={!tdlCode}>
                  Download TDL File
                </button>
                <button className="btn" onClick={copyToClipboard} disabled={!tdlCode}>
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="panel">
          <h2>📚 TDL Reference</h2>

          <div className="info-section">
            <h3>Common TDL Objects</h3>
            <ul>
              <li><strong>Report:</strong> Main reporting structure</li>
              <li><strong>Form:</strong> Defines form layout and structure</li>
              <li><strong>Part:</strong> Container for lines and fields</li>
              <li><strong>Line:</strong> Single line in a form or report</li>
              <li><strong>Field:</strong> Data input/display element</li>
              <li><strong>Collection:</strong> Data set from Tally objects</li>
              <li><strong>Menu:</strong> Menu items and navigation</li>
              <li><strong>Button:</strong> Action triggers with key bindings</li>
            </ul>
          </div>

          <div className="info-section">
            <h3>Common Attributes</h3>
            <ul>
              <li><strong>Use:</strong> Inherit from existing definition</li>
              <li><strong>Form:</strong> Specify form to display</li>
              <li><strong>Parts:</strong> List of parts in a form</li>
              <li><strong>Lines:</strong> List of lines in a part</li>
              <li><strong>Fields:</strong> List of fields in a line</li>
              <li><strong>Collection:</strong> Data source</li>
              <li><strong>Filter:</strong> Filter criteria</li>
              <li><strong>Set:</strong> Set value or expression</li>
            </ul>
          </div>

          <div className="info-section">
            <h3>How to Use</h3>
            <ul>
              <li>1. Create TDL code using Builder or Templates</li>
              <li>2. Download the .tdl file</li>
              <li>3. Copy to Tally installation folder</li>
              <li>4. Restart Tally Prime</li>
              <li>5. Your customizations will be loaded</li>
            </ul>
          </div>

          <div className="info-section">
            <h3>Installation Paths</h3>
            <ul>
              <li><strong>Windows:</strong> C:\Program Files\Tally.ERP9\</li>
              <li><strong>Linux:</strong> /opt/tallyprime/</li>
              <li>Place .tdl files in the installation directory</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
