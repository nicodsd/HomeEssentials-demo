import { useState } from "react";
import { FaCamera, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import apiUrl from "../../../api";
import { uploadFile } from "../../../firebase";
import Grid from "react-loading-icons/dist/esm/components/grid";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, Flip } from 'react-toastify';

const UserPanel = () => {
  const getStoredUser = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString && userString !== "undefined" ? JSON.parse(userString) : null;
    } catch {
      return null;
    }
  };

  const [infoUser, setInfoUser] = useState(getStoredUser);
  const [favorites] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [img, setImg] = useState(null);
  const [buttonSend, setButtonSend] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (name && name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (password && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {};
    if (formData.name.trim()) data.name = formData.name.trim();
    if (formData.lastName.trim()) data.lastName = formData.lastName.trim();
    if (formData.email.trim()) data.email = formData.email.trim();
    if (formData.password) data.password = formData.password;
    if (img) data.photo = img;

    if (Object.keys(data).length === 0) {
      toast.info("No changes to save.", { theme: "colored" });
      return;
    }

    if (!infoUser?._id) {
      toast.error("User session not found. Please sign in again.", { theme: "colored" });
      return;
    }

    try {
      setLoading(true);
      setButtonSend(true);
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl + `users/${infoUser._id}`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Failed to update profile.");
      }

      if (result.response) {
        setInfoUser(result.response);
        localStorage.setItem("user", JSON.stringify(result.response));
      }

      setFormData({ name: "", lastName: "", email: "", password: "" });
      setImg(null);
      toast.success(result.message || "Profile updated successfully!", {
        theme: "colored",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error updating profile.", { theme: "colored" });
    } finally {
      setLoading(false);
      setButtonSend(false);
    }
  };

  const handleSubmit = async (file) => {
    if (!file) return;
    try {
      setLoading(true);
      setButtonSend(true);
      const result = await uploadFile(file, "imgCV/");
      setImg(result);
      toast.success("Photo ready. Save changes to apply.", { theme: "colored" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.", { theme: "colored" });
    } finally {
      setButtonSend(false);
      setLoading(false);
    }
  };

  const avatarSrc = img || infoUser?.photo;

  return (
    <div className='bg-[#E7E7E7] flex min-h-screen flex-col justify-center items-center py-10 px-4 mt-12 sm:mt-0'>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <Grid className="bg-[#00000073] p-3 rounded-lg" />
        </div>
      )}

      <div className="w-full max-w-4xl p-6 sm:p-10 lg:p-14 rounded-lg shadow-lg bg-[#fff] flex flex-col lg:flex-row gap-8 lg:gap-10 items-center lg:items-stretch">
        <div className="w-full lg:w-[40%] flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-6">
          <label
            htmlFor="dropzone-file"
            className="group relative flex flex-col items-center justify-center rounded-full cursor-pointer"
            title="Change profile photo"
          >
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-[#7847E0]/30 bg-gray-100 flex items-center justify-center">
              {avatarSrc ? (
                <img src={avatarSrc} alt={infoUser?.name || "User avatar"} className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-5xl text-gray-400" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-medium gap-1">
                <FaCamera className="text-lg" />
                <span>Change photo</span>
              </div>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept="image/*"
              onChange={e => handleSubmit(e.target.files?.[0])}
              className="hidden"
            />
          </label>
          <div className="flex flex-col px-2 text-center sm:text-left lg:text-center">
            <p className="my-0.5 text-lg font-semibold text-gray-800">
              {[infoUser?.name, infoUser?.lastName].filter(Boolean).join(" ") || "User"}
            </p>
            <p className="my-0.5 text-sm font-normal text-gray-500 break-all">
              {infoUser?.email || "No email"}
            </p>
          </div>
        </div>

        <form onSubmit={handleForm} noValidate className="w-full text-[#7847E0] lg:w-[60%] flex flex-col justify-between gap-4">
          <h2 className="block text-start text-gray-700 text-lg font-semibold">Edit data</h2>

          <div className="flex flex-col">
            <div className={`flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#7847E0]/30 transition ${errors.name ? 'border-red-400' : 'border-[#7847E0]'}`}>
              <label htmlFor="panel-name" className="w-2/5 sm:w-1/3 px-3 py-2 font-semibold text-sm sm:text-base bg-[#7847E0]/5 border-r border-[#7847E0]/20">
                Name:
              </label>
              <input
                id="panel-name"
                value={formData.name}
                onChange={handleChange("name")}
                type="text"
                autoComplete="given-name"
                disabled={loading}
                className="w-full px-3 py-2 text-gray-700 appearance-none focus:outline-none bg-transparent"
                placeholder={infoUser?.name || "New name"}
              />
            </div>
            {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name}</span>}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center border border-[#7847E0] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#7847E0]/30 transition">
              <label htmlFor="panel-lastname" className="w-2/5 sm:w-1/3 px-3 py-2 font-semibold text-sm sm:text-base bg-[#7847E0]/5 border-r border-[#7847E0]/20">
                Last Name:
              </label>
              <input
                id="panel-lastname"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                type="text"
                autoComplete="family-name"
                disabled={loading}
                className="w-full px-3 py-2 text-gray-700 appearance-none focus:outline-none bg-transparent"
                placeholder={infoUser?.lastName || "New Last Name"}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className={`flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#7847E0]/30 transition ${errors.email ? 'border-red-400' : 'border-[#7847E0]'}`}>
              <label htmlFor="panel-email" className="w-2/5 sm:w-1/3 px-3 py-2 font-semibold text-sm sm:text-base bg-[#7847E0]/5 border-r border-[#7847E0]/20">
                Email:
              </label>
              <input
                id="panel-email"
                value={formData.email}
                onChange={handleChange("email")}
                type="email"
                autoComplete="email"
                disabled={loading}
                className="w-full px-3 py-2 text-gray-700 appearance-none focus:outline-none bg-transparent"
                placeholder={infoUser?.email || "New Email"}
              />
            </div>
            {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
          </div>

          <div className="flex flex-col">
            <div className={`relative flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#7847E0]/30 transition ${errors.password ? 'border-red-400' : 'border-[#7847E0]'}`}>
              <label htmlFor="panel-password" className="w-2/5 sm:w-1/3 px-3 py-2 font-semibold text-sm sm:text-base bg-[#7847E0]/5 border-r border-[#7847E0]/20">
                Password:
              </label>
              <input
                id="panel-password"
                value={formData.password}
                onChange={handleChange("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                disabled={loading}
                className="w-full px-3 py-2 pr-10 text-gray-700 appearance-none focus:outline-none bg-transparent"
                placeholder="New Password (min. 8)"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-[#7847E0]/70 hover:text-[#7847E0] focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password}</span>}
          </div>

          <div className="flex items-center justify-center pt-2">
            <button
              disabled={buttonSend || loading}
              type="submit"
              className="px-6 py-2.5 font-bold text-white bg-gradient-to-r from-[#7847E0] to-purple-500 rounded-md hover:from-[#6938d1] hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-[#7847E0]/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      {favorites.length < 0 && <div><div className='flex justify-center items-center pb-4'>
        <h3 className='font-bold text-gray-700 text-3xl mt-16'>Your favorites</h3>
      </div>
        <div className="p-4 sm:w-[70vw] rounded-lg shadow-lg flex flex-col lg:flex-row flex-wrap justify-evenly">
          {favorites.map((product) => (
            <div key={product.product_id._id} className="mb-10 cursor-pointer bg-white hover:scale-[1.03] shadow-[0_0_3px_rgba(0,0,0,0.20)] hover:shadow-[0_1px_7px_rgba(0,0,0,0.2)] rounded-md h-fit">
              <div className="font-normal my-2 text-[#393939] flex items-center justify-between min-h-[3rem] h-fit px-3">
                <img className="w-[6rem] h-[6rem] object-cover rounded-md " src={product.product_id.photo} alt="" />
                <div className="w-[8rem]">
                  <h2 className='text-xs ml-1'>{product.product_id.name}</h2>
                </div>
                <div className='text-md flex justify-end pr-2 w-[6.5rem]'>
                  <p>$ {product.product_id.price}</p>
                </div>
              </div>
              <div
                className='flex text-[#ff3b3b] bg-[#faf4ec] cursor-pointer border-t-[1px] rounded-b-md justify-end text-xs items-center pr-2 h-6'>
              </div>
            </div>
          ))}
        </div></div>}
      <ToastContainer
        transition={Flip}
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />
    </div>
  );
}

export default UserPanel;
