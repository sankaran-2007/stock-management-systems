import { useEffect, useMemo, useState } from 'react';
import api, { errMsg } from '../services/api';
import Loading from './Loading.jsx';

export const money = (v) =>
  '₹' + Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const badge = (s) => <span className={'badge ' + (s === 'Low Stock' ? 'red' : 'green')}>{s}</span>;

export const today = () => new Date().toISOString().slice(0, 10);

export function exportCSV(cols, rows, name) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.map((c) => esc(c.label)).join(','), ...rows.map((r) => cols.map((c) => esc(r[c.key])).join(','))].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = name + '.csv';
  a.click();
}

/* Generic table page: list, search, filters, add/edit/view/delete modal, CSV export, print. */
export default function Crud({ title, singular, endpoint, columns, fields = [], filters = [], readOnly = false }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [modalErr, setModalErr] = useState('');
  const [search, setSearch] = useState('');
  const [fv, setFv] = useState({});
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await api.get(endpoint);
      setRows(data);
    } catch (e) {
      setErr(errMsg(e));
    }
    setLoading(false);
  };

  useEffect(() => { load(); setSearch(''); setFv({}); }, [endpoint]);
  useEffect(() => { if (msg) { const t = setTimeout(() => setMsg(''), 3000); return () => clearTimeout(t); } }, [msg]);

  const shown = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase();
    if (q && !columns.some((c) => String(r[c.key] ?? '').toLowerCase().includes(q))) return false;
    return filters.every((f) => !fv[f.key] || String(r[f.key]) === fv[f.key]);
  }), [rows, search, fv]);

  const openAdd = () => {
    setModalErr('');
    setModal({ mode: 'add', data: Object.fromEntries(fields.map((f) => [f.name, f.default ?? ''])) });
  };
  const openEdit = (r) => { setModalErr(''); setModal({ mode: 'edit', data: { ...r } }); };
  const set = (name) => (e) => setModal({ ...modal, data: { ...modal.data, [name]: e.target.value } });

  const save = async (e) => {
    e.preventDefault();
    setModalErr('');
    setSaving(true);
    try {
      const d = modal.data;
      if (modal.mode === 'edit') await api.put(`${endpoint}/${d.id}`, d);
      else await api.post(endpoint, d);
      setMsg(modal.mode === 'edit' ? 'Updated successfully.' : 'Added successfully.');
      setModal(null);
      await load();
    } catch (e2) {
      setModalErr(errMsg(e2));
    }
    setSaving(false);
  };

  const remove = async (r) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`${endpoint}/${r.id}`);
      setMsg('Deleted successfully.');
      await load();
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  return (
    <>
      <div className="page-head">
        <h1>{title}</h1>
        <div className="toolbar">
          {!readOnly && <button className="btn" onClick={openAdd}>+ Add {singular || title}</button>}
          <button className="btn ghost" onClick={() => exportCSV(columns, shown, title)}>Export CSV</button>
          <button className="btn ghost" onClick={() => window.print()}>Print</button>
        </div>
      </div>
      {msg && <div className="alert ok">{msg}</div>}
      {err && <div className="alert bad">{err}</div>}

      <div className="toolbar filters">
        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {filters.map((f) => (
          <select key={f.key} value={fv[f.key] || ''} onChange={(e) => setFv({ ...fv, [f.key]: e.target.value })}>
            <option value="">{f.label}</option>
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}
      </div>

      {loading ? <Loading /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th className="actions">Actions</th></tr>
            </thead>
            <tbody>
              {shown.length === 0 && <tr><td colSpan={columns.length + 1} className="empty">No records found.</td></tr>}
              {shown.map((r) => (
                <tr key={r.id}>
                  {columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}
                  <td className="actions">
                    <button className="link" onClick={() => setModal({ mode: 'view', data: r })}>View</button>
                    {!readOnly && <button className="link" onClick={() => openEdit(r)}>Edit</button>}
                    {!readOnly && !fields.noDelete && <button className="link danger" onClick={() => remove(r)}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {modal.mode === 'view' ? (
              <>
                <h2>{singular || title} details</h2>
                <dl>
                  {Object.entries(modal.data).map(([k, v]) => (
                    <div key={k}><dt>{k.replace(/_/g, ' ')}</dt><dd>{String(v ?? '-')}</dd></div>
                  ))}
                </dl>
                <div className="modal-actions"><button className="btn" onClick={() => setModal(null)}>Close</button></div>
              </>
            ) : (
              <form onSubmit={save}>
                <h2>{modal.mode === 'edit' ? 'Edit' : 'Add'} {singular || title}</h2>
                {modalErr && <div className="alert bad">{modalErr}</div>}
                {fields.map((f) => (
                  <label key={f.name}>{f.label}
                    {f.type === 'select' ? (
                      <select required={f.required} value={modal.data[f.name] ?? ''} onChange={set(f.name)}>
                        <option value="">Select...</option>
                        {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea rows="3" value={modal.data[f.name] ?? ''} onChange={set(f.name)} />
                    ) : (
                      <input
                        type={f.type || 'text'} required={f.required} value={modal.data[f.name] ?? ''}
                        step={f.type === 'number' ? (f.step || '1') : undefined}
                        min={f.type === 'number' ? (f.min ?? 0) : undefined} onChange={set(f.name)}
                      />
                    )}
                  </label>
                ))}
                <div className="modal-actions">
                  <button type="button" className="btn ghost" onClick={() => setModal(null)}>Cancel</button>
                  <button className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
