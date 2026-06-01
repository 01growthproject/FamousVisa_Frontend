import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar/Navbar.jsx";
import CameraInput from "../Components/Admin/CameraInput.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import "./Styles/Form.css";

const API = import.meta.env.VITE_API_URL_FORM;

const FormContent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: "", surname: "", contact: "", email: "", gender: "", dob: "", age: "",
    country: "", nationality: "", preWorkExperience: "", maritalStatus: "", education: "",
    occupation: "", appliedFor: "", address: "", familyMembersCount: 0,
    hasGovtServant: "No", govtServantRelation: "", govtServantName: "",
    govtServantWorkType: "", govtServantDesignation: "", govtServantDepartment: "",
    consularName: "",
    fatherName: "", fatherSurname: "", fatherPhone: "", fatherEmail: "",
    motherName: "", motherSurname: "", motherPhone: "", motherEmail: "",
    spouseName: "", spouseSurname: "", spousePhone: "", spouseEmail: "",
    aadhaarCardNo: "", panCardNo: "", passportNo: "", drivingLicenseNo: "", voterCardNo: "",
    photo: null, documents: [],
  });

  const [documentsMeta, setDocumentsMeta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const totalSteps = 6;

  const stepTitles = [
    "Basic Information", "Document Numbers", "Family Details",
    "Document Capture", "Passport Size Photo", "Review & Submit",
  ];

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);
  const isValidAadhaar = (aadhaar) => /^[0-9]{12}$/.test(aadhaar);
  const isValidPAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
  const isValidPassport = (passport) => /^[A-Z0-9]{8,9}$/.test(passport.toUpperCase());
  const isValidDrivingLicense = (license) => /^[A-Z]{2}[0-9]{13}$/.test(license.toUpperCase());
  const isValidVoterCard = (voterCard) => /^[A-Z0-9]{10}$/.test(voterCard.toUpperCase());
  const isValidAge = (age) => { const n = parseInt(age); return n >= 1 && n <= 120; };
  const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age.toString();
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "clientName":
        if (!value.trim()) error = "Client name is required";
        else if (!isValidName(value)) error = "Only letters and spaces allowed";
        break;
      case "surname":
        if (value.trim() && !isValidName(value)) error = "Only letters and spaces allowed";
        break;
      case "contact":
        if (!value.trim()) error = "Contact number is required";
        else if (!isValidPhone(value)) error = "Enter valid 10-digit phone number";
        break;
      case "email":
        if (value.trim() && !isValidEmail(value)) error = "Enter valid email address";
        break;
      case "dob":
        if (!value) error = "Date of birth is required";
        else if (new Date(value) > new Date()) error = "Date cannot be in the future";
        break;
      case "age":
        if (!value) error = "Age is required";
        else if (!isValidAge(value)) error = "Enter valid age (1-120)";
        break;
      case "gender":
        if (!value) error = "Gender is required";
        break;
      case "maritalStatus":
        if (!value) error = "Marital status is required";
        break;
      case "nationality":
        if (!value.trim()) error = "Nationality is required";
        else if (!isValidName(value)) error = "Enter valid nationality";
        break;
      case "education":
        if (value.trim() && value.trim().length < 1) error = "Enter valid education";
        break;
      case "familyMembersCount":
        if (value && (parseInt(value) < 0 || parseInt(value) > 50)) error = "Enter valid number (0-50)";
        break;
      case "hasGovtServant":
        if (!value) error = "Please select an option";
        break;
      case "govtServantName":
        if (value && !isValidName(value)) error = "Only letters and spaces allowed (min 2 characters)";
        break;
      case "govtServantDesignation":
        if (value && value.trim().length < 2) error = "Enter valid designation (min 2 characters)";
        break;
      case "govtServantDepartment":
        if (value && value.trim().length < 2) error = "Enter valid department name (min 2 characters)";
        break;
      case "aadhaarCardNo":
        if (!value.trim()) error = "Aadhaar number is required";
        else if (!isValidAadhaar(value)) error = "Enter valid Aadhaar (e.g., 723412341234)";
        break;
      case "panCardNo":
        if (!value.trim()) error = "PAN number is required";
        else if (!isValidPAN(value)) error = "Enter valid PAN (e.g., ABCDE1234F)";
        break;
      case "passportNo":
        if (value.trim() && !isValidPassport(value)) error = "Enter valid Passport no (e.g., A1234567)";
        break;
      case "drivingLicenseNo":
        if (value.trim() && !isValidDrivingLicense(value)) error = "Enter valid license (e.g., MH1234567890123)";
        break;
      case "voterCardNo":
        if (value.trim() && !isValidVoterCard(value)) error = "Enter valid voter card (e.g., ABC1234567)";
        break;
      case "fatherName":
      case "motherName":
        if (!value.trim()) error = "This field is required";
        else if (!isValidName(value)) error = "Only letters and spaces allowed";
        break;
      case "fatherSurname":
      case "motherSurname":
        if (value.trim() && !isValidName(value)) error = "Only letters and spaces allowed";
        break;
      case "fatherPhone":
        if (!value.trim()) error = "Phone number is required";
        else if (!isValidPhone(value)) error = "Enter valid 10-digit phone number";
        break;
      case "motherPhone":
        if (value.trim() && !isValidPhone(value)) error = "Enter valid 10-digit phone number";
        break;
      case "fatherEmail": case "motherEmail": case "spouseEmail":
        if (value.trim() && !isValidEmail(value)) error = "Enter valid email address";
        break;
      case "spouseName": case "spouseSurname":
        if (value.trim() && !isValidName(value)) error = "Only letters and spaces allowed (min 2 characters)";
        break;
      case "spousePhone":
        if (value.trim() && !isValidPhone(value)) error = "Enter valid 10-digit phone number";
        break;
      default: break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dob") {
      const calculatedAge = calculateAge(value);
      setFormData((prev) => ({ ...prev, [name]: value, age: calculatedAge }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;
    switch (step) {
      case 1:
        const basicFields = ["clientName", "contact", "dob", "age", "gender", "maritalStatus", "nationality", "hasGovtServant"];
        basicFields.forEach((field) => {
          const error = validateField(field, formData[field]);
          if (error) { newErrors[field] = error; isValid = false; }
        });
        if (formData.surname) { const e = validateField("surname", formData.surname); if (e) { newErrors.surname = e; isValid = false; } }
        if (formData.hasGovtServant === "Yes") {
          if (!formData.govtServantRelation?.trim()) { newErrors.govtServantRelation = "Relation is required"; isValid = false; }
          if (!formData.govtServantName?.trim()) { newErrors.govtServantName = "Name is required"; isValid = false; }
          else { const e = validateField("govtServantName", formData.govtServantName); if (e) { newErrors.govtServantName = e; isValid = false; } }
          if (!formData.govtServantWorkType?.trim()) { newErrors.govtServantWorkType = "Work type is required"; isValid = false; }
          if (formData.govtServantDesignation) { const e = validateField("govtServantDesignation", formData.govtServantDesignation); if (e) { newErrors.govtServantDesignation = e; isValid = false; } }
        }
        if (formData.email) { const e = validateField("email", formData.email); if (e) { newErrors.email = e; isValid = false; } }
        if (formData.education) { const e = validateField("education", formData.education); if (e) { newErrors.education = e; isValid = false; } }
        if (formData.familyMembersCount) { const e = validateField("familyMembersCount", formData.familyMembersCount); if (e) { newErrors.familyMembersCount = e; isValid = false; } }
        break;
      case 2:
        ["aadhaarCardNo", "panCardNo"].forEach((field) => {
          const error = validateField(field, formData[field]);
          if (error) { newErrors[field] = error; isValid = false; }
        });
        ["passportNo", "drivingLicenseNo", "voterCardNo"].forEach((field) => {
          if (formData[field]) { const e = validateField(field, formData[field]); if (e) { newErrors[field] = e; isValid = false; } }
        });
        break;
      case 3:
        ["fatherName", "fatherPhone", "motherName"].forEach((field) => {
          const error = validateField(field, formData[field]);
          if (error) { newErrors[field] = error; isValid = false; }
        });
        if (formData.motherPhone) { const e = validateField("motherPhone", formData.motherPhone); if (e) { newErrors.motherPhone = e; isValid = false; } }
        ["fatherSurname", "motherSurname"].forEach((field) => {
          if (formData[field]) { const e = validateField(field, formData[field]); if (e) { newErrors[field] = e; isValid = false; } }
        });
        if (formData.fatherEmail) { const e = validateField("fatherEmail", formData.fatherEmail); if (e) { newErrors.fatherEmail = e; isValid = false; } }
        if (formData.motherEmail) { const e = validateField("motherEmail", formData.motherEmail); if (e) { newErrors.motherEmail = e; isValid = false; } }
        if (formData.maritalStatus === "Married") {
          ["spouseName", "spouseSurname", "spousePhone", "spouseEmail"].forEach((field) => {
            if (formData[field]) { const e = validateField(field, formData[field]); if (e) { newErrors[field] = e; isValid = false; } }
          });
        }
        break;
      case 4: isValid = true; break;
      case 5:
        if (!formData.photo) { newErrors.photo = "Passport photo is required"; isValid = false; }
        break;
      default: isValid = true;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleDocumentCapture = (type, file) => {
    const existingIndex = documentsMeta.findIndex((doc) => doc.documentType === type);
    if (existingIndex !== -1) {
      const updatedMeta = [...documentsMeta];
      updatedMeta[existingIndex] = { documentType: type };
      setDocumentsMeta(updatedMeta);
      const updatedDocs = [...formData.documents];
      updatedDocs[existingIndex] = file;
      setFormData((prev) => ({ ...prev, documents: updatedDocs }));
    } else {
      setDocumentsMeta((prev) => [...prev, { documentType: type }]);
      setFormData((prev) => ({ ...prev, documents: [...prev.documents, file] }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) { setCurrentStep(currentStep + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
    } else { toast.error("Please fix all errors before proceeding"); }
  };

  const prevStep = () => {
    if (currentStep > 1) { setCurrentStep(currentStep - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const goToStep = (step) => { setCurrentStep(step); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let i = 1; i <= 5; i++) {
      if (!validateStep(i)) { toast.error(`Please complete Step ${i} correctly`); setCurrentStep(i); return; }
    }
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => { if (key !== "documents") data.append(key, formData[key]); });
      data.append("documents", JSON.stringify(documentsMeta));
      formData.documents.forEach((doc) => data.append("documents", doc));
      await axios.post(API, data, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Client Registered Successfully ✅");
      setFormData({
        clientName: "", surname: "", contact: "", email: "", gender: "", dob: "", age: "",
        country: "", nationality: "", preWorkExperience: "", maritalStatus: "", education: "",
        occupation: "", appliedFor: "", address: "", familyMembersCount: 0,
        hasGovtServant: "No", govtServantRelation: "", govtServantName: "",
        govtServantWorkType: "", govtServantDesignation: "", govtServantDepartment: "",
        consularName: "",
        fatherName: "", fatherSurname: "", fatherPhone: "", fatherEmail: "",
        motherName: "", motherSurname: "", motherPhone: "", motherEmail: "",
        spouseName: "", spouseSurname: "", spousePhone: "", spouseEmail: "",
        aadhaarCardNo: "", panCardNo: "", passportNo: "", drivingLicenseNo: "", voterCardNo: "",
        photo: null, documents: [],
      });
      setDocumentsMeta([]);
      setErrors({});
      setCurrentStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error ❌");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {

      case 1:
        return (
          <div className="form-section active">
            <h3 className="section-title">Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Client name</label>
                <input name="clientName" placeholder="Enter client name" value={formData.clientName}
                  onChange={handleChange} onBlur={handleBlur} className={errors.clientName ? "error" : ""} />
                {errors.clientName && <span className="error-message">{errors.clientName}</span>}
              </div>
              <div className="form-group">
                <label className="optional">Surname</label>
                <input name="surname" placeholder="Enter surname (optional)" value={formData.surname}
                  onChange={handleChange} onBlur={handleBlur} className={errors.surname ? "error" : ""} />
                {errors.surname && <span className="error-message">{errors.surname}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact number</label>
                <input name="contact" placeholder="Enter 10-digit contact number" value={formData.contact}
                  onChange={handleChange} onBlur={handleBlur} className={errors.contact ? "error" : ""} maxLength="10" />
                {errors.contact && <span className="error-message">{errors.contact}</span>}
              </div>
              <div className="form-group">
                <label className="optional">Email</label>
                <input name="email" type="email" placeholder="Enter email" value={formData.email}
                  onChange={handleChange} onBlur={handleBlur} className={errors.email ? "error" : ""} />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date of birth</label>
                <input type="date" name="dob" value={formData.dob}
                  onChange={handleChange} onBlur={handleBlur} className={errors.dob ? "error" : ""}
                  max={new Date().toISOString().split("T")[0]} />
                {errors.dob && <span className="error-message">{errors.dob}</span>}
              </div>
              <div className="form-group">
                <label>Age</label>
                <input name="age" placeholder="Auto calculated" value={formData.age}
                  onChange={handleChange} onBlur={handleBlur} className={errors.age ? "error" : ""}
                  min="1" max="120" readOnly />
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="optional">Previous country</label>
                <input name="country" placeholder="Enter country" value={formData.country} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Nationality</label>
                <input name="nationality" placeholder="Enter nationality" value={formData.nationality}
                  onChange={handleChange} onBlur={handleBlur} className={errors.nationality ? "error" : ""} />
                {errors.nationality && <span className="error-message">{errors.nationality}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="optional">Pre work experience</label>
                <input name="preWorkExperience" placeholder="Enter previous work experience"
                  value={formData.preWorkExperience} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="optional">Applied for</label>
                <input name="appliedFor" placeholder="e.g. Malta Work Visa, Canada PR"
                  value={formData.appliedFor} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender}
                  onChange={handleChange} onBlur={handleBlur} className={errors.gender ? "error" : ""}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="error-message">{errors.gender}</span>}
              </div>
              <div className="form-group">
                <label>Marital status</label>
                <select name="maritalStatus" value={formData.maritalStatus}
                  onChange={handleChange} onBlur={handleBlur} className={errors.maritalStatus ? "error" : ""}>
                  <option value="">Select status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Separated">Separated</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
                {errors.maritalStatus && <span className="error-message">{errors.maritalStatus}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="optional">Education</label>
                <input name="education" placeholder="e.g. B.Tech, 12th, MBA-Finance" value={formData.education}
                  onChange={handleChange} onBlur={handleBlur} className={errors.education ? "error" : ""} />
                {errors.education && <span className="error-message">{errors.education}</span>}
              </div>
              <div className="form-group">
                <label className="optional">Occupation</label>
                <input name="occupation" placeholder="Enter occupation" value={formData.occupation} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="optional">Family members</label>
                <input name="familyMembersCount" type="number" placeholder="Number of family members"
                  value={formData.familyMembersCount} onChange={handleChange} onBlur={handleBlur}
                  className={errors.familyMembersCount ? "error" : ""} min="0" max="50" />
                {errors.familyMembersCount && <span className="error-message">{errors.familyMembersCount}</span>}
              </div>
              <div className="form-group full-width">
                <label className="optional">Address</label>
                <textarea name="address" placeholder="Enter complete address"
                  value={formData.address} onChange={handleChange} rows="3" />
              </div>
            </div>

            <h3 className="section-title" style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
              🏛️ Government servant information
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label>Any family member is government servant?</label>
                <select name="hasGovtServant" value={formData.hasGovtServant}
                  onChange={handleChange} onBlur={handleBlur} className={errors.hasGovtServant ? "error" : ""}>
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.hasGovtServant && <span className="error-message">{errors.hasGovtServant}</span>}
              </div>
            </div>

            {formData.hasGovtServant === "Yes" && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Relation with you</label>
                    <select name="govtServantRelation" value={formData.govtServantRelation}
                      onChange={handleChange} onBlur={handleBlur} className={errors.govtServantRelation ? "error" : ""}>
                      <option value="">Select relation</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse (Husband/Wife)</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Aunt">Aunt</option>
                      <option value="Grandfather">Grandfather</option>
                      <option value="Grandmother">Grandmother</option>
                      <option value="Other">Other relative</option>
                    </select>
                    {errors.govtServantRelation && <span className="error-message">{errors.govtServantRelation}</span>}
                  </div>
                  <div className="form-group">
                    <label>Name of government servant</label>
                    <input name="govtServantName" placeholder="Enter full name" value={formData.govtServantName}
                      onChange={handleChange} onBlur={handleBlur} className={errors.govtServantName ? "error" : ""} />
                    {errors.govtServantName && <span className="error-message">{errors.govtServantName}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Work type / organisation</label>
                    <select name="govtServantWorkType" value={formData.govtServantWorkType}
                      onChange={handleChange} onBlur={handleBlur} className={errors.govtServantWorkType ? "error" : ""}>
                      <option value="">Select work type</option>
                      <option value="Central Government">Central Government</option>
                      <option value="State Government">State Government</option>
                      <option value="PSU (Public Sector Undertaking)">PSU (Public Sector Undertaking)</option>
                      <option value="Indian Army">Indian Army</option>
                      <option value="Indian Navy">Indian Navy</option>
                      <option value="Indian Air Force">Indian Air Force</option>
                      <option value="Police Department">Police Department</option>
                      <option value="Railway">Railway</option>
                      <option value="Banking Sector">Banking Sector (Government)</option>
                      <option value="Teaching (Government School/College)">Teaching (Government School/College)</option>
                      <option value="Medical (Government Hospital)">Medical (Government Hospital)</option>
                      <option value="Judiciary">Judiciary</option>
                      <option value="Municipal Corporation">Municipal Corporation</option>
                      <option value="Other Government Department">Other Government Department</option>
                    </select>
                    {errors.govtServantWorkType && <span className="error-message">{errors.govtServantWorkType}</span>}
                  </div>
                  <div className="form-group">
                    <label className="optional">Designation / post</label>
                    <input name="govtServantDesignation" placeholder="e.g., Deputy Collector, Teacher, Inspector"
                      value={formData.govtServantDesignation} onChange={handleChange} onBlur={handleBlur}
                      className={errors.govtServantDesignation ? "error" : ""} />
                    {errors.govtServantDesignation && <span className="error-message">{errors.govtServantDesignation}</span>}
                  </div>
                </div>
              </>
            )}

            <h3 className="section-title" style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
              🌐 Consular information
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label className="optional">Consular name</label>
                <input name="consularName" placeholder="Enter consular name"
                  value={formData.consularName} onChange={handleChange} />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-section active">
            <h3 className="section-title">Document numbers</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Aadhaar card no.</label>
                <input name="aadhaarCardNo" placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarCardNo}
                  onChange={handleChange} onBlur={handleBlur} className={errors.aadhaarCardNo ? "error" : ""} maxLength="12" />
                {errors.aadhaarCardNo && <span className="error-message">{errors.aadhaarCardNo}</span>}
              </div>
              <div className="form-group">
                <label>PAN card no.</label>
                <input name="panCardNo" placeholder="Enter PAN (e.g., ABCDE1234F)" value={formData.panCardNo}
                  onChange={handleChange} onBlur={handleBlur} className={errors.panCardNo ? "error" : ""} maxLength="10" />
                {errors.panCardNo && <span className="error-message">{errors.panCardNo}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="optional">Passport no.</label>
                <input name="passportNo" placeholder="Enter Passport (e.g., A1234567)" value={formData.passportNo}
                  onChange={handleChange} onBlur={handleBlur} className={errors.passportNo ? "error" : ""} maxLength="9" />
                {errors.passportNo && <span className="error-message">{errors.passportNo}</span>}
              </div>
              <div className="form-group">
                <label className="optional">Driving license no.</label>
                <input name="drivingLicenseNo" placeholder="Enter License (e.g., MH1234567890123)" value={formData.drivingLicenseNo}
                  onChange={handleChange} onBlur={handleBlur} className={errors.drivingLicenseNo ? "error" : ""} maxLength="15" />
                {errors.drivingLicenseNo && <span className="error-message">{errors.drivingLicenseNo}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="optional">Voter card no.</label>
                <input name="voterCardNo" placeholder="Enter Voter Card (e.g., ABC1234567)" value={formData.voterCardNo}
                  onChange={handleChange} onBlur={handleBlur} className={errors.voterCardNo ? "error" : ""} maxLength="10" />
                {errors.voterCardNo && <span className="error-message">{errors.voterCardNo}</span>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-section active">
            <h3 className="section-title">Father details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Father name</label>
                <input name="fatherName" placeholder="Enter father's name" value={formData.fatherName}
                  onChange={handleChange} onBlur={handleBlur} className={errors.fatherName ? "error" : ""} />
                {errors.fatherName && <span className="error-message">{errors.fatherName}</span>}
              </div>
              <div className="form-group">
                <label className="optional">Father surname</label>
                <input name="fatherSurname" placeholder="Enter father's surname (optional)" value={formData.fatherSurname}
                  onChange={handleChange} onBlur={handleBlur} className={errors.fatherSurname ? "error" : ""} />
                {errors.fatherSurname && <span className="error-message">{errors.fatherSurname}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Father phone</label>
                <input name="fatherPhone" placeholder="Enter 10-digit phone number" value={formData.fatherPhone}
                  onChange={handleChange} onBlur={handleBlur} className={errors.fatherPhone ? "error" : ""} maxLength="10" />
                {errors.fatherPhone && <span className="error-message">{errors.fatherPhone}</span>}
              </div>
              <div className="form-group">
                <label className="optional">Father email</label>
                <input name="fatherEmail" type="email" placeholder="Enter father's email" value={formData.fatherEmail}
                  onChange={handleChange} onBlur={handleBlur} className={errors.fatherEmail ? "error" : ""} />
                {errors.fatherEmail && <span className="error-message">{errors.fatherEmail}</span>}
              </div>
            </div>

            <h3 className="section-title" style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
              Mother details
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label>Mother name</label>
                <input name="motherName" placeholder="Enter mother's name" value={formData.motherName}
                  onChange={handleChange} onBlur={handleBlur} className={errors.motherName ? "error" : ""} />
                {errors.motherName && <span className="error-message">{errors.motherName}</span>}
              </div>
              <div className="form-group">
                <label className="optional">Mother surname</label>
                <input name="motherSurname" placeholder="Enter mother's surname (optional)" value={formData.motherSurname}
                  onChange={handleChange} onBlur={handleBlur} className={errors.motherSurname ? "error" : ""} />
                {errors.motherSurname && <span className="error-message">{errors.motherSurname}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="optional">Mother phone</label>
                <input name="motherPhone" placeholder="Enter 10-digit phone number (optional)" value={formData.motherPhone}
                  onChange={handleChange} onBlur={handleBlur} className={errors.motherPhone ? "error" : ""} maxLength="10" />
                {errors.motherPhone && <span className="error-message">{errors.motherPhone}</span>}
              </div>
              <div className="form-group">
                <label className="optional">Mother email</label>
                <input name="motherEmail" type="email" placeholder="Enter mother's email" value={formData.motherEmail}
                  onChange={handleChange} onBlur={handleBlur} className={errors.motherEmail ? "error" : ""} />
                {errors.motherEmail && <span className="error-message">{errors.motherEmail}</span>}
              </div>
            </div>

            {formData.maritalStatus === "Married" && (
              <>
                <h3 className="section-title" style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
                  Spouse details
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="optional">Spouse name</label>
                    <input name="spouseName" placeholder="Enter spouse's name" value={formData.spouseName}
                      onChange={handleChange} onBlur={handleBlur} className={errors.spouseName ? "error" : ""} />
                    {errors.spouseName && <span className="error-message">{errors.spouseName}</span>}
                  </div>
                  <div className="form-group">
                    <label className="optional">Spouse surname</label>
                    <input name="spouseSurname" placeholder="Enter spouse's surname" value={formData.spouseSurname}
                      onChange={handleChange} onBlur={handleBlur} className={errors.spouseSurname ? "error" : ""} />
                    {errors.spouseSurname && <span className="error-message">{errors.spouseSurname}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="optional">Spouse phone</label>
                    <input name="spousePhone" placeholder="Enter 10-digit phone number" value={formData.spousePhone}
                      onChange={handleChange} onBlur={handleBlur} className={errors.spousePhone ? "error" : ""} maxLength="10" />
                    {errors.spousePhone && <span className="error-message">{errors.spousePhone}</span>}
                  </div>
                  <div className="form-group">
                    <label className="optional">Spouse email</label>
                    <input name="spouseEmail" type="email" placeholder="Enter spouse's email" value={formData.spouseEmail}
                      onChange={handleChange} onBlur={handleBlur} className={errors.spouseEmail ? "error" : ""} />
                    {errors.spouseEmail && <span className="error-message">{errors.spouseEmail}</span>}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div className="form-section active">
            <h3 className="section-title">📸 Live document capture</h3>
            <p className="hint">Capture all documents using your camera (front &amp; back where applicable)</p>
            <div className="documents-grid">
              {[
                ["Aadhaar front *", "AadhaarFront"],
                ["Aadhaar back *", "AadhaarBack"],
                ["PAN card *", "PANCard"],
                ["Passport front *", "PassportFront"],
                ["Passport back *", "PassportBack"],
                ["Driving license front", "DrivingLicenseFront"],
                ["Driving license back", "DrivingLicenseBack"],
                ["Voter card front", "VoterCardFront"],
                ["Voter card back", "VoterCardBack"],
                ["Marksheet front", "MarksheetFront"],
                ["Marksheet back", "MarksheetBack"],
                ["CV page 1", "CVPage1"],
                ["CV page 2", "CVPage2"],
              ].map(([label, type]) => (
                <div key={type} className="document-capture-item">
                  <CameraInput label={label} setFile={(file) => handleDocumentCapture(type, file)} />
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-section active">
            <h3 className="section-title">👤 Passport size photo</h3>
            <p className="hint">Capture client's passport size photo (35mm x 45mm ratio)</p>
            {errors.photo && (
              <span className="error-message" style={{ display: "block", marginBottom: "10px" }}>
                {errors.photo}
              </span>
            )}
            <div className="passport-photo-container">
              <div className="passport-photo-frame">
                <CameraInput
                  label="Capture photo"
                  setFile={(file) => {
                    setFormData((prev) => ({ ...prev, photo: file }));
                    setErrors((prev) => ({ ...prev, photo: "" }));
                  }}
                  isPassportSize={true}
                />
              </div>
              <div className="passport-guidelines">
                <p>📏 <strong>Guidelines:</strong></p>
                <ul>
                  <li>Face should be clearly visible</li>
                  <li>Plain white or light background</li>
                  <li>No glasses or hat</li>
                  <li>Neutral expression</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="form-section active">
            <h3 className="section-title">📋 Review &amp; submit</h3>
            <div className="review-section">
              <div className="review-card">
                <h4>Basic information</h4>
                {[
                  ["Full name", `${formData.clientName}${formData.surname ? " " + formData.surname : ""}`],
                  ["Contact", formData.contact],
                  ["Email", formData.email],
                  ["Date of birth", formData.dob],
                  ["Age", formData.age],
                  ["Gender", formData.gender],
                  ["Marital status", formData.maritalStatus],
                  ["Country", formData.country],
                  ["Nationality", formData.nationality],
                  ["Education", formData.education],
                  ["Occupation", formData.occupation],
                  ["Applied for", formData.appliedFor],
                  ["Family members", formData.familyMembersCount],
                  ["Address", formData.address],
                ].map(([label, val]) => (
                  <div key={label} className="review-item">
                    <span>{label}:</span>
                    <strong>{val || "N/A"}</strong>
                  </div>
                ))}
                <button className="edit-btn" onClick={() => goToStep(1)}>Edit</button>
              </div>

              <div className="review-card">
                <h4>✈️ Additional information</h4>
                {[
                  ["Pre work experience", formData.preWorkExperience],
                  ["Consular name", formData.consularName],
                ].map(([label, val]) => (
                  <div key={label} className="review-item">
                    <span>{label}:</span>
                    <strong>{val || "N/A"}</strong>
                  </div>
                ))}
                <button className="edit-btn" onClick={() => goToStep(1)}>Edit</button>
              </div>

              <div className="review-card">
                <h4>🏛️ Government servant information</h4>
                <div className="review-item">
                  <span>Family member in govt service:</span>
                  <strong>{formData.hasGovtServant || "N/A"}</strong>
                </div>
                {formData.hasGovtServant === "Yes" && (
                  [["Relation", formData.govtServantRelation], ["Name", formData.govtServantName],
                   ["Work type", formData.govtServantWorkType], ["Designation", formData.govtServantDesignation]].map(([l, v]) => (
                    <div key={l} className="review-item"><span>{l}:</span><strong>{v || "N/A"}</strong></div>
                  ))
                )}
                <button className="edit-btn" onClick={() => goToStep(1)}>Edit</button>
              </div>

              <div className="review-card">
                <h4>Document numbers</h4>
                {[["Aadhaar", formData.aadhaarCardNo], ["PAN", formData.panCardNo],
                  ["Passport", formData.passportNo], ["Driving license", formData.drivingLicenseNo],
                  ["Voter card", formData.voterCardNo]].map(([l, v]) => (
                  <div key={l} className="review-item"><span>{l}:</span><strong>{v || "N/A"}</strong></div>
                ))}
                <button className="edit-btn" onClick={() => goToStep(2)}>Edit</button>
              </div>

              <div className="review-card">
                <h4>Father details</h4>
                {[["Name", `${formData.fatherName}${formData.fatherSurname ? " " + formData.fatherSurname : ""}`],
                  ["Phone", formData.fatherPhone], ["Email", formData.fatherEmail]].map(([l, v]) => (
                  <div key={l} className="review-item"><span>{l}:</span><strong>{v || "N/A"}</strong></div>
                ))}
                <button className="edit-btn" onClick={() => goToStep(3)}>Edit</button>
              </div>

              <div className="review-card">
                <h4>Mother details</h4>
                {[["Name", `${formData.motherName}${formData.motherSurname ? " " + formData.motherSurname : ""}`],
                  ["Phone", formData.motherPhone], ["Email", formData.motherEmail]].map(([l, v]) => (
                  <div key={l} className="review-item"><span>{l}:</span><strong>{v || "N/A"}</strong></div>
                ))}
                <button className="edit-btn" onClick={() => goToStep(3)}>Edit</button>
              </div>

              {formData.maritalStatus === "Married" && (
                <div className="review-card">
                  <h4>Spouse details</h4>
                  {[["Name", `${formData.spouseName}${formData.spouseSurname ? " " + formData.spouseSurname : ""}`],
                    ["Phone", formData.spousePhone], ["Email", formData.spouseEmail]].map(([l, v]) => (
                    <div key={l} className="review-item"><span>{l}:</span><strong>{v || "N/A"}</strong></div>
                  ))}
                  <button className="edit-btn" onClick={() => goToStep(3)}>Edit</button>
                </div>
              )}

              <div className="review-card">
                <h4>Captured documents</h4>
                <div className="review-item">
                  <span>Total documents:</span>
                  <strong>{documentsMeta.length} file(s)</strong>
                </div>
                {documentsMeta.map((doc, i) => (
                  <div key={i} className="review-item">
                    <span>• {doc.documentType}:</span><strong>✓ Captured</strong>
                  </div>
                ))}
                {documentsMeta.length === 0 && (
                  <div className="review-item"><span>Status:</span><strong className="warning-text">No documents captured</strong></div>
                )}
                <button className="edit-btn" onClick={() => goToStep(4)}>Edit documents</button>
              </div>

              <div className="review-card">
                <h4>Passport size photo</h4>
                <div className="review-item">
                  <span>Client photo:</span>
                  <strong className={formData.photo ? "success-text" : "warning-text"}>
                    {formData.photo ? "✓ Captured" : "✗ Not captured"}
                  </strong>
                </div>
                {formData.photo && (
                  <div className="review-item"><span>File name:</span><strong>{formData.photo.name}</strong></div>
                )}
                <button className="edit-btn" onClick={() => goToStep(5)}>Edit photo</button>
              </div>

              {!formData.photo && (
                <div className="review-card warning-card">
                  <h4>⚠️ Incomplete submission</h4>
                  <div className="review-item"><span>Missing:</span><strong>Passport size photo (required)</strong></div>
                  <p className="hint">Please capture passport photo before submitting.</p>
                </div>
              )}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="form-wrapper">
        <div className="form-container">
          <div className="form-header">
            <h2>Registration Form 📋</h2>
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
            </div>
            <div className="progress-text">Step {currentStep} of {totalSteps}</div>
          </div>
          <div className="step-indicators">
            {stepTitles.map((title, index) => (
              <div key={index}
                className={`step-indicator ${currentStep === index + 1 ? "active" : ""} ${currentStep > index + 1 ? "completed" : ""}`}
                onClick={() => goToStep(index + 1)}>
                <div className="step-number">{currentStep > index + 1 ? "✓" : index + 1}</div>
                <div className="step-label">{title}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="form">
            {renderStepContent()}
            <div className="form-actions">
              {currentStep > 1 && (
                <button type="button" className="prev-btn" onClick={prevStep}>← Previous</button>
              )}
              {currentStep < totalSteps && (
                <button type="button" className="next-btn" onClick={nextStep}>Next →</button>
              )}
              {currentStep === totalSteps && (
                <button type="submit" className="submit-btn" disabled={loading || !formData.photo}>
                  {loading ? <><div className="spinner"></div>Submitting...</> : "Submit ✓"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const Form = () => (
  <ProtectedRoute>
    <FormContent />
  </ProtectedRoute>
);

export default Form;