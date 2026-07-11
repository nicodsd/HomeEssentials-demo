import apiUrl from '../../api';
import { useState, useEffect } from 'react';

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setIsLoading(true);
                const [usersRes, categoriesRes] = await Promise.all([
                    fetch(`${apiUrl}users`).then(res => {
                        if (!res.ok) throw new Error('Error al cargar usuarios');
                        return res.json();
                    }),
                    fetch(`${apiUrl}categories`).then(res => {
                        if (!res.ok) throw new Error('Error al cargar categorías');
                        return res.json();
                    })
                ]);

                setUsers(usersRes?.data?.users || []);
                setCategories(categoriesRes?.data?.categories || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("No se pudo conectar con el servidor. Por favor, intenta más tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f5f9]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
                <p className="text-slate-500 font-medium text-sm">Cargando panel de administración...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] px-4">
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Error de Conexión</h3>
                    <p className="text-slate-500 text-sm mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-[#f8fafc] text-slate-700 antialiased selection:bg-indigo-500 selection:text-white">
            <div className="w-full max-w-6xl mx-auto">

                {/* --- HEADER --- */}
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Admin Panel
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Gestiona los usuarios de la plataforma y configura promociones globales.</p>
                </header>

                {/* --- STATS OVERVIEW --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Usuarios</p>
                            <h3 className="text-3xl font-black text-slate-800 mt-1">{users.length}</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Categorías Activas</p>
                            <h3 className="text-3xl font-black text-slate-800 mt-1">{categories.length}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-8 w-full">

                    {/* --- USER LIST SECTION --- */}
                    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">User List</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                        <th className="p-4 pl-6">Usuario</th>
                                        <th className="p-4 hidden sm:table-cell">Correo Electrónico</th>
                                        <th className="p-4 pr-6 text-right sm:text-left">Rol</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {users.map((user) => (
                                        <tr key={user.id || user._id} className="hover:bg-slate-50/80 transition-colors duration-150">
                                            <td className="p-4 pl-6 flex items-center gap-3">
                                                <img
                                                    src={user.photo || 'https://via.placeholder.com/150'}
                                                    alt={`${user.name}`}
                                                    className="w-10 h-10 rounded-full object-cover bg-slate-100 ring-2 ring-white shadow-sm"
                                                />
                                                <div>
                                                    <p className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">
                                                        {user.name} {user.lastName}
                                                    </p>
                                                    <p className="text-xs text-slate-400 sm:hidden mt-1">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-slate-500 hidden sm:table-cell">
                                                {user.email}
                                            </td>
                                            <td className="p-4 pr-6 text-right sm:text-left">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide capitalize ${user.role === 'admin'
                                                    ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                                    : 'bg-slate-50 text-slate-600 border border-slate-100'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="p-8 text-center text-slate-400 text-sm">
                                                No se encontraron usuarios registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* --- OFF SALE LIST SECTION --- */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full mb-12">
                        <div className="border-b border-slate-100 pb-4 mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Off Sale List</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Aplica descuentos porcentuales directamente sobre las colecciones.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categories.map((category) => {
                                // Determinamos si el fondo personalizado es muy claro o requiere ajustes
                                const customBg = category.hover || '#f8fafc';
                                const brandColor = category.color || '#4f46e5';

                                return (
                                    <div
                                        key={category._id || category.id}
                                        className="group relative overflow-hidden rounded-xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all duration-200 hover:shadow-md border border-slate-100 bg-white"
                                    >
                                        {/* Badge sutil de color de marca lateral */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: brandColor }} />

                                        <img
                                            src={category.coverPhoto}
                                            alt={category.name}
                                            className="w-20 h-20 rounded-lg object-cover shadow-inner bg-slate-50 shrink-0"
                                        />

                                        <div className="flex flex-col w-full text-center sm:text-left">
                                            <h3 className="font-black text-lg tracking-tight" style={{ color: brandColor }}>
                                                {category.name}
                                            </h3>

                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 w-full">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs text-slate-400 font-medium">Precio Regular: <span className="line-through">$100</span></span>
                                                    <span className="text-sm font-bold text-emerald-600">Oferta: $80</span>
                                                </div>

                                                <div className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
                                                    <div className="relative shrink-0">
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            className="w-20 pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg outline-none font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50"
                                                        />
                                                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                                                            %
                                                        </span>
                                                    </div>
                                                    <button
                                                        className="px-4 py-1.5 rounded-lg text-white text-xs font-bold shadow-sm hover:brightness-95 active:scale-95 transition-all whitespace-nowrap"
                                                        style={{ backgroundColor: brandColor }}
                                                    >
                                                        Descontar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {categories.length === 0 && (
                                <div className="col-span-full p-8 text-center text-slate-400 text-sm">
                                    No hay categorías disponibles en este momento.
                                </div>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}