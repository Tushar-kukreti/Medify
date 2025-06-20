import React, { useState } from "react";
import { motion } from "framer-motion";
import { doctor_banner1, doctor_banner2, doctor_banner3 } from "../assets/Doc/init";
import { ImFolderUpload } from "react-icons/im";
import { DOCTOR_GROUPING } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../app/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const doctorBanners = [doctor_banner1, doctor_banner2, doctor_banner3];

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("user");
  const [bannerId] = useState(Math.floor(Math.random() * doctorBanners.length));
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, userInfo, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    role: "user",
    email: "",
    password: "",
    userName: "",
    fullName: "",
    gender: "",
    date_of_birth: "",
    weight: "",
    height: "",
    dietary_preference: "",
    bloodGroup: "",
    avatar: null,
    cover: null,
    certificate: [],
    certificationsName: "",
    specialization: "none",
    experience: "",
    groupId: "0",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((p) => ({
        ...p,
        [name]: name === "certificate" ? Array.from(files) : files[0],
      }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleCategoryChange = (e) => {
    const gid = e.target.value;
    setSelectedCategory(gid);
    setFormData((p) => ({ ...p, groupId: gid, specialization: "" }));
  };

  const getRequired = () => {
    if (step === 1) return ["email", "password", "userName", "fullName"];
    if (step === 2) return ["gender", "date_of_birth", "weight", "height"];
    if (step === 3)
      return role === "user"
        ? ["bloodGroup"]
        : ["groupId", "specialization", "experience", "certificate", "certificationsName"];
    return [];
  };

  const validate = () => {
    const req = getRequired();
    const errs = req.filter((f) => {
      const v = formData[f];
      return v === "" || v == null || (Array.isArray(v) && v.length === 0);
    });
    setErrors(errs);
    return errs.length === 0;
  };

  const onNext = () => {
    if (validate()) {
      setStep((s) => s + 1);
      setErrors([]);
    }
  };

  const onBack = () => {
    setStep((s) => s - 1);
    setErrors([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((f) => payload.append(key, f));
      } else {
        payload.append(key, val);
      }
    });

    dispatch(registerUser(payload))
      .unwrap()
      .then(() => {
        toast.success("Registered Successfully", { position: "bottom-left" });
        navigate("/login");
      })
      .catch((msg) => {
        toast.error(msg || "Registration failed", { position: "bottom-left" });
      });
  };

  const showError = (n) =>
    errors.includes(n) && <p className="text-red-500 text-sm">Required</p>;

  const renderInput = (n, ph, t = "text", req = true) => (
    <div className="space-y-1">
      <input
        type={t}
        name={n}
        placeholder={req ? `${ph} *` : ph}
        value={formData[n]}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 transition"
      />
      {req && showError(n)}
    </div>
  );

  const renderFile = (n, label, mult = false) => {
    const done = formData[n] && (mult ? formData[n].length > 0 : true);
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>{label} *</span>
          {!done && (
            <label className="bg-bg_sky text-white px-3 py-1 rounded cursor-pointer">
              <ImFolderUpload />
              <input
                type="file"
                name={n}
                onChange={handleChange}
                multiple={mult}
                accept="image/*"
                className="hidden"
              />
            </label>
          )}
        </div>
        {showError(n)}
        {done && (
          <div className="flex flex-wrap gap-2">
            {mult
              ? formData[n].map((f, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(f)}
                      className="w-16 h-16 rounded border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          [n]: p[n].filter((_, idx) => idx !== i),
                        }))
                      }
                      className="absolute top-0 right-0 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))
              : (
                <div className="flex items-center gap-2">
                  <img
                    src={URL.createObjectURL(formData[n])}
                    className="w-16 h-16 rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, [n]: null }))}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              )}
          </div>
        )}
      </div>
    );
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <>
          <div className="flex gap-4 justify-center">
            {["user", "doctor"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setFormData((p) => ({ ...p, role: r }));
                }}
                className={`px-4 py-2 border rounded-2xl ${
                  role === r ? "bg-bg_sky text-white" : "bg-white"
                }`}
              >
                I'm a {r}
              </button>
            ))}
          </div>
          {renderInput("email", "Email")}
          {renderInput("password", "Password", "password")}
          {renderInput("userName", "Username")}
          {renderInput("fullName", "Full Name")}
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <div>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select Gender *</option>
              <option>male</option>
              <option>female</option>
              <option>other</option>
            </select>
            {showError("gender")}
          </div>
          {renderInput("date_of_birth", "Date of Birth", "date")}
          {renderInput("weight", "Weight (kg)", "number")}
          {renderInput("height", "Height (cm)", "number")}
          {renderInput("dietary_preference", "Dietary Preference", "text", false)}
          {renderFile("avatar", "Upload Avatar")}
          {renderFile("cover", "Upload Cover Image")}
        </>
      );
    }

    // step 3
    if (role === "user") {
      return (
        <div>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select Blood Group *</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
              <option key={bg}>{bg}</option>
            ))}
          </select>
          {showError("bloodGroup")}
        </div>
      );
    } else {
      return (
        <>
          <select
            name="groupId"
            value={formData.groupId}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select Category *</option>
            {DOCTOR_GROUPING.map((g) => (
              <option key={g.groupId} value={g.groupId}>
                {g.category}
              </option>
            ))}
          </select>
          {showError("groupId")}

          <select
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            disabled={!selectedCategory}
            className="w-full px-4 py-2 border rounded disabled:bg-gray-100"
          >
            <option value="">Select Specialization *</option>
            {DOCTOR_GROUPING.find((g) => g.groupId === selectedCategory)
              ?.specializations.map((s) => (
                <option key={s}>{s}</option>
              ))}
          </select>
          {showError("specialization")}

          {renderInput("experience", "Years of Experience", "number")}
          {renderInput("certificationsName", "Certificates Name")}
          {renderFile("certificate", "Upload Certificates", true)}
        </>
      );
    }
  };

  return (
    <div className="min-h-screen flex md:flex-row flex-col">
      <div className="md:w-1/2 bg-cyan-100 flex items-center justify-center p-10">
        <img src={doctorBanners[bannerId]} className="w-full max-w-md" />
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-center">Create Account</h2>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {renderStep()}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={loading}
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="px-4 py-2 bg-bg_sky text-white rounded hover:bg-bg_grey"
                  disabled={loading}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? "Registering…" : "Register"}
                </button>
              )}
            </div>

            <div className="text-center">
              Already have an account?&nbsp;
              <span
                className="text-bg_sky cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Log in
              </span>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
