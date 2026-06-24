import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Plus,
    Ticket as TicketIcon,
    LogOut,
    ArrowLeft,
    Sparkles,
    ChevronRight,
    GraduationCap,
    AlertTriangle,
    CheckCircle2,
    FileText,
    MapPin,
    Tag,
    Flag,
    Phone,
    Image as ImageIcon,
    UploadCloud,
    X,
    Send,
    Info,
} from 'lucide-react'
import { clearToken, getMe } from '../../services/auth'
import { createTicket, CATEGORY_LABELS, PRIORITY_LABELS } from '../../services/ticket'

const CATEGORIES = Object.keys(CATEGORY_LABELS)
const PRIORITIES = Object.keys(PRIORITY_LABELS)

function validate(form, files) {
    const errors = {}
    if (!form.title.trim() || form.title.trim().length < 5)
        errors.title = 'Title must be at least 5 characters'
    if (!form.resourceLocation.trim())
        errors.resourceLocation = 'Resource or location is required'
    if (!form.category)
        errors.category = 'Please select a category'
    if (!form.priority)
        errors.priority = 'Please select a priority'
    if (!form.description.trim() || form.description.trim().length < 10)
        errors.description = 'Description must be at least 10 characters'
    if (!form.contactNumber.trim())
        errors.contactNumber = 'Contact number is required'
    else {
        const digitsOnly = form.contactNumber.trim().replace(/\D/g, '')
        if (digitsOnly.length !== 10)
            errors.contactNumber = 'Contact number must contain exactly 10 digits'
    }
    if (files.length > 3)
        errors.files = 'Maximum 3 images allowed'
    files.forEach(f => {
        if (f.size > 5 * 1024 * 1024)
            errors.files = 'Each image must be under 5 MB'
        if (!f.type.startsWith('image/'))
            errors.files = 'Only image files are allowed'
    })
    return errors
}

function Sidebar({ user, navigate }) {
    const logout = () => { clearToken(); navigate('/auth') }
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/tickets' },
        { id: 'create', label: 'Create Ticket', icon: Plus, to: '/tickets/create' },
        { id: 'my', label: 'My Tickets', icon: TicketIcon, to: '/tickets/my' },
    ]
    const active = 'create'
    return (
        <aside className="relative flex flex-col bg-gradient-to-b from-[#0b1a3a] via-[#0c1f44] to-[#0a1730] text-slate-200">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.18),transparent_60%)]" />

            <div className="relative border-b border-white/10 px-5 py-6">
                <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-900/40">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-lg font-bold tracking-tight text-white">Smart Campus</p>
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300/80">Incident Ticketing</p>
                    </div>
                </div>
            </div>

            <div className="relative px-3 py-5">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Navigation</p>
                <div className="mt-2 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = active === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.to)}
                                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                                    isActive
                                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 font-semibold text-white shadow-lg shadow-cyan-900/30'
                                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="flex-1">{item.label}</span>
                                {!isActive && <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="relative mt-auto border-t border-white/10 px-4 py-4 space-y-2">
                {user && (
                    <div className="mb-1 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-bold text-white">
                            {user.username?.charAt(0)?.toUpperCase() ?? 'U'}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-white">{user.username}</p>
                            <p className="text-[10px] text-slate-400">Student</p>
                        </div>
                    </div>
                )}
                <button onClick={() => navigate('/dashboard/student')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600/40 bg-slate-700/30 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700/50">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </button>
                <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:border-rose-400/50 hover:bg-rose-500/20">
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default function CreateTicketPage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [form, setForm] = useState({
        title: '',
        resourceLocation: '',
        category: '',
        priority: 'MEDIUM',
        description: '',
        contactNumber: '',
    })
    const [files, setFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState('')
    const [apiError, setApiError] = useState('')

    useEffect(() => {
        getMe().then(setUser).catch(() => {})
    }, [])

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }

    const handleFiles = (e) => {
        const selected = Array.from(e.target.files)
        const combined = [...files, ...selected]

        if (combined.length > 3) {
            setErrors(prev => ({ ...prev, files: 'Maximum 3 images allowed. Only the first 3 were kept.' }))
            const sliced = combined.slice(0, 3)
            setFiles(sliced)
            setPreviews(sliced.map(f => URL.createObjectURL(f)))
        } else {
            setErrors(prev => ({ ...prev, files: '' }))
            setFiles(combined)
            setPreviews(combined.map(f => URL.createObjectURL(f)))
        }
    }

    const removeFile = (idx) => {
        setFiles(prev => prev.filter((_, i) => i !== idx))
        setPreviews(prev => prev.filter((_, i) => i !== idx))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate(form, files)
        if (Object.keys(errs).length > 0) { setErrors(errs); return }

        setSubmitting(true)
        setApiError('')
        setSuccess('')
        try {
            await createTicket({ ...form, files })
            setSuccess('Ticket submitted successfully!')
            setTimeout(() => navigate('/tickets/my'), 1500)
        } catch (err) {
            setApiError(err?.response?.data?.message || 'Failed to submit ticket. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const inputBase = 'w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-4'
    const inputOk = 'border-slate-200 bg-white hover:border-blue-300 focus:border-blue-400 focus:ring-blue-100'
    const inputBad = 'border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-100'

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
                <Sidebar user={user} navigate={navigate} />

                <main className="p-4 sm:p-8">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                                <Sparkles className="h-3 w-3" />
                                Module C
                            </div>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Create Incident Ticket</h1>
                            <p className="mt-1 text-sm text-slate-500">Report a campus facility or equipment issue.</p>
                        </div>
                    </div>

                    {success && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                            {success}
                        </div>
                    )}
                    {apiError && (
                        <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{apiError}</span>
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                        {/* ── Main form card ──────────────────────────────── */}
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-5 text-white">
                                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-3xl" />
                                <div className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl" />
                                <div className="relative flex items-center gap-3">
                                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur ring-1 ring-white/25">
                                        <TicketIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold">Ticket Details</h2>
                                        <p className="text-xs text-blue-100">Fill in the form to submit your incident report.</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
                                {/* Title */}
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                                        Ticket Title <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Projector not working in Room B-204"
                                        className={`${inputBase} ${errors.title ? inputBad : inputOk}`}
                                    />
                                    {errors.title && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600"><Info className="h-3 w-3" />{errors.title}</p>}
                                </div>

                                {/* Resource / Location */}
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                        <MapPin className="h-3.5 w-3.5 text-blue-600" />
                                        Resource or Location <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="resourceLocation"
                                        name="resourceLocation"
                                        value={form.resourceLocation}
                                        onChange={handleChange}
                                        placeholder="e.g. Computer Lab B-204, Block B"
                                        className={`${inputBase} ${errors.resourceLocation ? inputBad : inputOk}`}
                                    />
                                    {errors.resourceLocation && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600"><Info className="h-3 w-3" />{errors.resourceLocation}</p>}
                                </div>

                                {/* Category + Priority */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                            <Tag className="h-3.5 w-3.5 text-blue-600" />
                                            Category <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={form.category}
                                            onChange={handleChange}
                                            className={`${inputBase} ${errors.category ? inputBad : inputOk}`}
                                        >
                                            <option value="">Select category</option>
                                            {CATEGORIES.map(c => (
                                                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                                            ))}
                                        </select>
                                        {errors.category && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600"><Info className="h-3 w-3" />{errors.category}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                            <Flag className="h-3.5 w-3.5 text-blue-600" />
                                            Priority <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            id="priority"
                                            name="priority"
                                            value={form.priority}
                                            onChange={handleChange}
                                            className={`${inputBase} ${errors.priority ? inputBad : inputOk}`}
                                        >
                                            {PRIORITIES.map(p => (
                                                <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                                            ))}
                                        </select>
                                        {errors.priority && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600"><Info className="h-3 w-3" />{errors.priority}</p>}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                                        Description <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Describe the issue clearly — what happened, when it occurred, and any error messages."
                                        className={`${inputBase} resize-none ${errors.description ? inputBad : inputOk}`}
                                    />
                                    <div className="mt-1.5 flex items-center justify-between">
                                        {errors.description
                                            ? <p className="flex items-center gap-1 text-xs font-medium text-rose-600"><Info className="h-3 w-3" />{errors.description}</p>
                                            : <p className="text-xs text-slate-500">Minimum 10 characters</p>}
                                        <p className="text-xs font-medium text-slate-500">{form.description.length}/1000</p>
                                    </div>
                                </div>

                                {/* Contact Number */}
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                        <Phone className="h-3.5 w-3.5 text-blue-600" />
                                        Preferred Contact Number <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="contactNumber"
                                        name="contactNumber"
                                        type="tel"
                                        value={form.contactNumber}
                                        onChange={handleChange}
                                        placeholder="e.g. 77 1234567 or +94771234567"
                                        className={`${inputBase} ${errors.contactNumber ? inputBad : inputOk}`}
                                    />
                                    <div className="mt-1.5 flex items-center justify-between">
                                        {errors.contactNumber
                                            ? <p className="flex items-center gap-1 text-xs font-medium text-rose-600"><Info className="h-3 w-3" />{errors.contactNumber}</p>
                                            : <p className="text-xs text-slate-500">Must be exactly 10 digits (spaces, +, - allowed)</p>}
                                        <p className="text-xs font-medium text-slate-500">{form.contactNumber.replace(/\D/g, '').length}/10 digits</p>
                                    </div>
                                </div>

                                {/* Image Attachments */}
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                        <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
                                        Image Attachments
                                        <span className="font-normal text-slate-400">(Max 3 images, 5 MB each)</span>
                                    </label>
                                    <label className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 transition hover:bg-slate-50 ${errors.files ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'}`}>
                                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-4 ring-blue-50">
                                            <UploadCloud className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <p className="mt-3 text-sm font-semibold text-slate-700">Click to upload images</p>
                                        <p className="mt-0.5 text-xs text-slate-500">PNG, JPG, WEBP — max 3 files</p>
                                        <input
                                            id="files"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleFiles}
                                        />
                                    </label>
                                    {errors.files && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600"><Info className="h-3 w-3" />{errors.files}</p>}

                                    {previews.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-3">
                                            {previews.map((src, idx) => (
                                                <div key={idx} className="group/preview relative h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                                                    <img src={src} alt="" className="h-full w-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(idx)}
                                                        className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-white shadow-md transition hover:scale-110 hover:bg-rose-600"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        id="submit-ticket-btn"
                                        disabled={submitting}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-900/30 active:scale-[0.98] disabled:opacity-60"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                Submit Ticket
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* ── Side info panel ─────────────────────────────── */}
                        <aside className="space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-100 text-blue-600">
                                        <Info className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900">Tips for a great ticket</h3>
                                </div>
                                <ul className="mt-4 space-y-3">
                                    {[
                                        'Use a clear, specific title that summarizes the problem',
                                        'Mention the exact room or asset so technicians find it fast',
                                        'Attach photos when possible — they speed up triage',
                                        'Pick the right priority so urgent issues get attention',
                                    ].map((tip, i) => (
                                        <li key={tip} className="flex items-start gap-3">
                                            <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-[10px] font-bold text-white">
                                                {i + 1}
                                            </span>
                                            <span className="text-xs leading-relaxed text-slate-600">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50/60 p-5">
                                <div className="flex items-center gap-2">
                                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-white text-amber-600 ring-1 ring-amber-100">
                                        <AlertTriangle className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900">Urgent issue?</h3>
                                </div>
                                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                                    For safety hazards or anything blocking class operations, pick <span className="font-semibold text-amber-700">High</span> or <span className="font-semibold text-rose-700">Urgent</span> priority so it goes to the top of the queue.
                                </p>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    )
}
