"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  Loader2, ArrowLeft, Save, User, Mail, Lock, Briefcase, 
  Phone, Calendar, Hash, Shield, Sparkles, Building2, BadgeCheck 
} from "lucide-react";

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
    firstName: "",
    lastName: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    employeeCode: ""
  });

  useEffect(() => {
    setMounted(true);
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.post("/user/all-role");
      const d = res.data;
      let list: { id: number; name: string }[] = [];
      if (Array.isArray(d)) list = d;
      else if (d && Array.isArray(d.data)) list = d.data;
      setRoles(list);
    } catch (error) {
      console.error("Failed to fetch roles", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        roles: formData.role ? [formData.role] : ["USER"],
        employee: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          department: formData.department,
          designation: formData.designation,
          joiningDate: formData.joiningDate,
          employeeCode: formData.employeeCode
        }
      };

      await api.post("/user/create", payload);
      router.push("/users");
    } catch (error) {
      console.error("Failed to create user", error);
      alert("Failed to create user. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mx-auto max-w-5xl relative transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
       {/* Ambient Background Glows */}
       <div className="absolute top-20 left-10 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
       <div className="absolute bottom-20 right-10 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 backdrop-blur-sm">
              <Sparkles className="mr-1 h-3 w-3" />
              New Member
            </span>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">Create User</h1>
          <p className="mt-2 text-gray-400 text-lg">Enter user details and employee information to create a new account.</p>
        </div>
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 rounded-xl border border-gray-700 bg-[#151A25]/50 backdrop-blur-sm px-5 py-3 text-sm font-medium text-gray-300 shadow-lg hover:bg-gray-800 hover:text-white transition-all hover:border-gray-500 hover:shadow-blue-500/10 hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Users
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2 relative z-10">
        {/* Account Details Card */}
        <div className="group rounded-3xl bg-[#151A25]/80 backdrop-blur-xl p-8 shadow-2xl border border-gray-800/50 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 text-blue-400 shadow-inner ring-1 ring-blue-500/20">
                <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Account Access</h2>
              <p className="text-sm text-gray-500">Login credentials and role</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Username</label>
              <div className="relative group/input">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-hover/input:text-blue-400 transition-colors" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-[#0B0E14] pl-11 pr-4 py-3.5 text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all placeholder:text-gray-600 hover:border-gray-700"
                  placeholder="jdoe"
                />
              </div>
            </div>
            
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-hover/input:text-blue-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-[#0B0E14] pl-11 pr-4 py-3.5 text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all placeholder:text-gray-600 hover:border-gray-700"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Password</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-hover/input:text-blue-400 transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-[#0B0E14] pl-11 pr-4 py-3.5 text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all placeholder:text-gray-600 hover:border-gray-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Role</label>
              <div className="relative group/input">
                <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-hover/input:text-blue-400 transition-colors" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-[#0B0E14] pl-11 pr-4 py-3.5 text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all appearance-none hover:border-gray-700"
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Details Card */}
        <div className="group rounded-3xl bg-[#151A25]/80 backdrop-blur-xl p-8 shadow-2xl border border-gray-800/50 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300 hover:-translate-y-1" style={{ transitionDelay: "100ms" }}>
          <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-6">
             <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 text-purple-400 shadow-inner ring-1 ring-purple-500/20">
                <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Employee Profile</h2>
              <p className="text-sm text-gray-500">Personal and professional details</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-[#0B0E14] px-4 py-3.5 text-gray-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all placeholder:text-gray-600 hover:border-gray-700"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-[#0B0E14] px-4 py-3.5 text-gray-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all placeholder:text-gray-600 hover:border-gray-700"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Employee Code</label>
              <div className="relative group/input">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-hover/input:text-purple-400 transition-colors" />
                <input
                  type="text"
                  name="employeeCode"
                  required
                  value={formData.employeeCode}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-[#0B0E14] pl-11 pr-4 py-3.5 text-gray-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all placeholder:text-gray-600 hover:border-gray-700"
                  placeholder="EMP-001"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Phone Number</label>
              <div className="relative group/input">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-hover/input:text-purple-400 transition-colors" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-[#0B0E14] pl-11 pr-4 py-3.5 text-gray-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all placeholder:text-gray-600 hover:border-gray-700"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Department</label>
                <div className="relative group/input">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-hover/input:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-800 bg-[#0B0E14] pl-11 pr-4 py-3.5 text-gray-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all placeholder:text-gray-600 hover:border-gray-700"
                    placeholder="Engineering"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  required
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-[#0B0E14] px-4 py-3.5 text-gray-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all placeholder:text-gray-600 hover:border-gray-700"
                  placeholder="Developer"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Joining Date</label>
              <div className="relative group/input">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-hover/input:text-purple-400 transition-colors" />
                <input
                  type="date"
                  name="joiningDate"
                  required
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-[#0B0E14] pl-11 pr-4 py-3.5 text-gray-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all [color-scheme:dark] hover:border-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-12 py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000 group-hover:translate-x-full" />
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                Create Account
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
