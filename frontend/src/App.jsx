import React, { useState } from 'react'
import { FileText, UploadCloud, Sparkles, Target, BriefcaseBusiness, CheckCircle2, AlertCircle, Loader2, BrainCircuit } from 'lucide-react'

const API = 'http://127.0.0.1:8000'

function Score({value, label}) {
  return <div className="score-card"><div className="score-ring" style={{'--score': `${value || 0}%`}}><span>{value ?? '—'}{value !== null && value !== undefined ? '%' : ''}</span></div><div><b>{label}</b><small>{label === 'Job match' && value == null ? 'Add a job description' : 'Indicative score'}</small></div></div>
}
function Section({title, children}) { return <section className="result-section"><h3>{title}</h3>{children}</section> }

export default function App() {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function analyze(e) {
    e.preventDefault()
    if (!file) { setError('Please choose your resume first.'); return }
    setLoading(true); setError(''); setData(null)
    const form = new FormData()
    form.append('resume', file); form.append('job_description', jd)
    try {
      const res = await fetch(`${API}/analyze`, {method: 'POST', body: form})
      const body = await res.json()
      if (!res.ok) throw new Error(body.detail || 'Analysis failed. Check that the backend is running.')
      setData(body)
    } catch (err) { setError(err.message || 'Could not connect to backend. Start FastAPI on port 8000.') }
    finally { setLoading(false) }
  }

  return <div className="app-shell">
    <header className="topbar"><div className="brand"><span className="brand-icon"><BrainCircuit size={22}/></span><span>Resume<span className="brand-accent">IQ</span></span></div><span className="top-label">GENAI CAREER TOOL</span></header>
    <main>
      <div className="hero">
        <div className="eyebrow"><Sparkles size={15}/> AI-POWERED CAREER ASSISTANT</div>
        <h1>Make your resume<br/><span>work smarter.</span></h1>
        <p>Upload your resume to uncover your strengths, identify skill gaps, and get actionable feedback powered by AI.</p>
      </div>
      <div className="workspace">
        <form className="upload-panel" onSubmit={analyze}>
          <div className="panel-heading"><div><h2>Analyze your resume</h2><p>Start with your latest resume file.</p></div><FileText size={23}/></div>
          <label className="dropzone">
            <input type="file" accept=".pdf,.docx" onChange={e => {setFile(e.target.files[0] || null); setError('')}}/>
            <UploadCloud size={31}/>
            <b>{file ? file.name : 'Choose a resume to upload'}</b>
            <span>{file ? `${(file.size/1024).toFixed(0)} KB · Ready to analyze` : 'Drag and drop is not required · PDF or DOCX · Max 8 MB'}</span>
            <em>Browse files</em>
          </label>
          <label className="field-label" htmlFor="jd">Target job description <span>OPTIONAL</span></label>
          <textarea id="jd" value={jd} onChange={e=>setJd(e.target.value)} placeholder="Paste the job description here to compare your resume with the role requirements..." rows="5"/>
          <button className="analyze-btn" disabled={loading}>{loading ? <><Loader2 className="spin" size={18}/> Analyzing resume...</> : <><Sparkles size={18}/> Analyze Resume</>}</button>
          {error && <div className="error"><AlertCircle size={17}/>{error}</div>}
          <p className="privacy-note">Your file is processed by this local project backend. If Gemini is configured, extracted resume text is sent to Google's Gemini API for AI feedback.</p>
        </form>
        <aside className="how-panel">
          <h3>What you'll get</h3>
          <div className="benefit"><span><Target size={19}/></span><div><b>Resume quality score</b><small>Review the completeness of your resume.</small></div></div>
          <div className="benefit"><span><BriefcaseBusiness size={19}/></span><div><b>Job match analysis</b><small>Compare your skills with a target role.</small></div></div>
          <div className="benefit"><span><CheckCircle2 size={19}/></span><div><b>Skill gap detection</b><small>See matched and missing job skills.</small></div></div>
          <div className="benefit"><span><Sparkles size={19}/></span><div><b>AI recommendations</b><small>Get practical ideas to improve your resume.</small></div></div>
          <div className="tip"><b>Good to know</b><p>Use a text-based PDF or DOCX for the best extraction results. Scanned image-only PDFs are not supported in this version.</p></div>
        </aside>
      </div>
      {data && <div className="results">
        <div className="results-head"><div><div className="eyebrow"><Sparkles size={14}/> ANALYSIS COMPLETE</div><h2>Your resume insights</h2></div><span className="mode-pill">{data.analysis_mode}</span></div>
        <div className="score-grid"><Score value={data.quality_score} label="Resume quality"/><Score value={data.match_score} label="Job match"/><div className="metric-card"><b>{data.word_count}</b><span>Words extracted</span></div><div className="metric-card"><b>{data.skills.length}</b><span>Skills detected</span></div></div>
        <Section title="Detected skills"><div className="chips">{data.skills.length ? data.skills.map(s=><span className="chip" key={s}>{s}</span>) : <p>No listed skills detected. Consider adding a clear Skills section.</p>}</div></Section>
        {jd.trim() && <Section title="Job description comparison"><div className="skill-columns"><div><h4 className="green">Matched skills ({data.matched_skills.length})</h4><div className="chips">{data.matched_skills.map(s=><span className="chip good" key={s}>{s}</span>)}{!data.matched_skills.length && <small>None detected yet</small>}</div></div><div><h4 className="red">Skills to develop / evidence ({data.missing_skills.length})</h4><div className="chips">{data.missing_skills.map(s=><span className="chip missing" key={s}>{s}</span>)}{!data.missing_skills.length && <small>No missing listed skills detected</small>}</div></div></div></Section>}
        <Section title="Recommended job roles"><div className="role-list">{data.role_recommendations.map(r=><div className="role" key={r.role}><b>{r.role}</b><div className="bar"><span style={{width:`${r.score}%`}}/></div><strong>{r.score}%</strong></div>)}{!data.role_recommendations.length && <p>Add skills to receive role suggestions.</p>}</div></Section>
        <Section title="Improvement recommendations"><ul className="suggestions">{data.suggestions.map((s,i)=><li key={i}>{s}</li>)}</ul></Section>
        {data.ai_feedback && <Section title="Generative AI feedback"><div className="ai-feedback">{data.ai_feedback}</div></Section>}
        <Section title="Extracted resume preview"><pre className="preview">{data.extracted_preview}</pre></Section>
        <p className="disclaimer">Scores are indicative educational estimates based on detected text and skills. They are not hiring decisions or guarantees.</p>
      </div>}
    </main>
    <footer>ResumeIQ · AI Resume Analyzer · Academic GenAI Project</footer>
  </div>
}
