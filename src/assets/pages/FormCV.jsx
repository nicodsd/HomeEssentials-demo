import { useState } from "react";
import { uploadFile } from "../../../firebase";
import Grid from "react-loading-icons/dist/esm/components/grid";
import apiUrl from "../../../api";
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

export default function FormCV() {
    const navigate = useNavigate();

    // Estado unificado para información personal
    const [personalInfo, setPersonalInfo] = useState({
        name: "",
        lastName: "",
        email: "",
        age: ""
    });

    // Estados dinámicos usando Arrays reales (Adiós a countStudies, Studies1, etc.)
    const [studies, setStudies] = useState([]);
    const [experience, setExperience] = useState([]);
    const [references, setReferences] = useState([]);

    // Archivos en memoria local antes de subirlos
    const [imgFile, setImgFile] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [cvFile, setCvFile] = useState(null);

    const [loading, setLoading] = useState(false);

    // Manejador de cambios de texto personales
    const handlePersonalChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
    };

    // Previsualizar la imagen seleccionada localmente (UX Top)
    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgFile(file);
            setImgPreview(URL.createObjectURL(file));
        }
    };

    // Agregar campos dinámicos (Máximo 3)
    const addField = (state, setState) => {
        if (state.length < 3) setState([...state, ""]);
    };

    const removeField = (state, setState, index) => {
        setState(state.filter((_, i) => i !== index));
    };

    const handleDynamicChange = (index, value, state, setState) => {
        const updated = [...state];
        updated[index] = value;
        setState(updated);
    };

    // Envío unificado del formulario
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Validación básica de UX
        if (!personalInfo.name || !personalInfo.email || !cvFile) {
            toast.error("Please fill in the required fields and upload your CV file.");
            return;
        }

        try {
            setLoading(true);

            // 1. Subir archivos a Firebase de manera simultánea (Optimización de tiempo)
            let uploadedImgUrl = imgPreview;
            let uploadedCvUrl = null;

            const uploadPromises = [];

            if (imgFile) {
                uploadPromises.push(uploadFile(imgFile, "imgCV/").then(url => uploadedImgUrl = url));
            }
            if (cvFile) {
                uploadPromises.push(uploadFile(cvFile, "imgCV/").then(url => uploadedCvUrl = url));
            }

            await Promise.all(uploadPromises);

            // 2. Formatear la data exactamente como la espera tu backend
            const finalData = {
                ...personalInfo,
                img: uploadedImgUrl,
                cv: uploadedCvUrl,
                studies: [{
                    studies1: studies[0] || "nothing",
                    studies2: studies[1] || "nothing",
                    studies3: studies[2] || "nothing"
                }],
                experience: [{
                    experience1: experience[0] || "nothing",
                    experience2: experience[1] || "nothing",
                    experience3: experience[2] || "nothing"
                }],
                references: [{
                    references1: references[0] || "nothing",
                    references2: references[1] || "nothing",
                    references3: references[2] || "nothing"
                }]
            };

            // 3. Petición al servidor
            const res = await fetch(`${apiUrl}curriculums`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData)
            }).then(res => res.json());

            toast.success(`${res.Curriculums?.name || 'User'}, your CV was successfully saved!`, {
                theme: "colored"
            });

            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred while saving.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen w-full flex items-center justify-center p-4 md:p-10 bg-slate-100 text-slate-800">

            {/* Pantalla de carga bloqueante global (Mejora drástica de UX) */}
            {loading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 text-white">
                    <Grid stroke="#7847E0" className="w-12 h-12" />
                    <p className="font-semibold text-lg animate-pulse">Uploading data and files...</p>
                </div>
            )}

            <form
                onSubmit={handleFormSubmit}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-10 space-y-8"
            >
                {/* Encabezado dinámico */}
                <div className="text-center border-b border-slate-100 pb-6">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {personalInfo.name ? `${personalInfo.name}'s CV` : "Curriculum Vitae"}
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Complete your professional profile application</p>
                </div>

                {/* Sección: Información Personal */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                        <span>👤</span> Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4">
                            <input
                                type="text" name="name" placeholder="First Name *" required
                                value={personalInfo.name} onChange={handlePersonalChange}
                                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm text-slate-900"
                            />
                            <input
                                type="text" name="lastName" placeholder="Last Name"
                                value={personalInfo.lastName} onChange={handlePersonalChange}
                                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm text-slate-900"
                            />
                            <input
                                type="email" name="email" placeholder="Email Address *" required
                                value={personalInfo.email} onChange={handlePersonalChange}
                                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm text-slate-900"
                            />
                            <input
                                type="number" name="age" placeholder="Age"
                                value={personalInfo.age} onChange={handlePersonalChange}
                                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm text-slate-900"
                            />
                        </div>

                        {/* Selector de Foto / Avatar */}
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 hover:bg-slate-100/70 transition-all min-h-[200px]">
                            {imgPreview ? (
                                <div className="relative group w-32 h-32">
                                    <img src={imgPreview} alt="Preview" className="w-full h-full object-cover rounded-full shadow-md border-2 border-white ring-4 ring-indigo-50" />
                                    <button
                                        type="button"
                                        onClick={() => { setImgFile(null); setImgPreview(null); }}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs shadow hover:bg-red-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center cursor-pointer text-center group w-full h-full">
                                    <svg className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600">Upload Photo</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG up to 5MB</span>
                                    <input type="file" accept="image/*" onChange={handleImgChange} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mapeador de Secciones Dinámicas (Estudios, Experiencia, Referencias) */}
                {[
                    { label: "🎓 Education & Studies", state: studies, setState: setStudies, placeholder: "e.g., Bachelor in Computer Science - Harvard" },
                    { label: "💼 Work Experience", state: experience, setState: setExperience, placeholder: "e.g., Senior Fullstack Developer at Google (2 years)" },
                    { label: "📞 Professional References", state: references, setState: setReferences, placeholder: "e.g., John Doe - Tech Lead (john@company.com)" }
                ].map((section, sIdx) => (
                    <div key={sIdx} className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-700">{section.label}</h3>
                            {section.state.length < 3 && (
                                <button
                                    type="button" onClick={() => addField(section.state, section.setState)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                                >
                                    + Add Item
                                </button>
                            )}
                        </div>

                        {section.state.length === 0 && (
                            <p className="text-xs text-slate-400 italic">No entries added yet.</p>
                        )}

                        <div className="space-y-2">
                            {section.state.map((value, index) => (
                                <div key={index} className="flex gap-2 items-center animate-fadeIn">
                                    <input
                                        type="text" placeholder={section.placeholder} value={value}
                                        onChange={(e) => handleDynamicChange(index, e.target.value, section.state, section.setState)}
                                        className="w-full p-2.5 rounded-xl border border-slate-300 outline-none text-sm text-slate-900 focus:border-indigo-500"
                                    />
                                    <button
                                        type="button" onClick={() => removeField(section.state, section.setState, index)}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors text-sm"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Sección: Archivo del CV en PDF */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                    <label className="block text-sm font-bold text-slate-700">Attach Curriculum File (PDF/Doc) *</label>
                    <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 font-semibold text-sm transition-colors">
                            📁 Choose File
                            <input
                                type="file" accept=".pdf,.doc,.docx" required={!cvFile}
                                onChange={e => setCvFile(e.target.files[0])} className="hidden"
                            />
                        </label>
                        <span className="text-xs text-slate-500 truncate max-w-[250px]">
                            {cvFile ? cvFile.name : "No file chosen"}
                        </span>
                    </div>
                </div>

                {/* Botón Submit final */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold tracking-wide shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.99] transition-all"
                    >
                        Submit Application
                    </button>
                </div>
            </form>

            <ToastContainer
                transition={Flip}
                position="bottom-right"
                autoClose={2500}
                hideProgressBar
                closeOnClick
                theme="light"
            />
        </section>
    );
}