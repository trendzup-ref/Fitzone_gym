import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin authentication
  const checkAuth = async () => {
    try {
      const response = await api.get("/admin/dashboard");

      if (response.data.success) {
        setAdmin(response.data.admin);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication when application loads
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    const response = await api.post("/admin/login", {
      email,
      password,
    });

    if (response.data.success) {
      setAdmin(response.data.admin);
      setIsAuthenticated(true);
    }

    return response.data;
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/admin/logout");
    } finally {
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  // Add Membership
const addMembership = async (membershipData) => {
  try {
    const response = await api.post(
      "/membership/add",
      membershipData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Membership List
const getMemberships = async () => {
  try {
    const response = await api.get("/membership/list");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete Membership
const deleteMembership = async (id) => {
  try {
    const response = await api.delete(`/membership/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Single Membership
const getMembershipById = async (id) => {
  try {
    const response = await api.get(`/membership/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update Membership
const updateMembership = async (id, membershipData) => {
  try {
    const response = await api.put(
      `/membership/${id}`,
      membershipData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Members List
const getMembers = async () => {
  try {
    const response = await api.get("/member/list");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete Member
const deleteMember = async (id) => {
  try {
    const response = await api.delete(`/member/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const addMember = async (memberData) => {
  try {
    const response = await api.post("/member/add", memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


// Get Single Member
const getMemberById = async (id) => {
  try {
    const response = await api.get(`/member/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update Member
const updateMember = async (id, memberData) => {
  try {
    const response = await api.put(`/member/${id}`, memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ================= TRAINER APIs =================

// Get All Trainers
const getTrainers = async () => {
  try {
    const response = await api.get("/trainer/list");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Add Trainer
const addTrainer = async (trainerData) => {
  try {
    const response = await api.post(
      "/trainer/add",
      trainerData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Single Trainer
const getTrainerById = async (id) => {
  try {
    const response = await api.get(`/trainer/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update Trainer
const updateTrainer = async (id, trainerData) => {
  try {
    const response = await api.put(
      `/trainer/${id}`,
      trainerData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete Trainer
const deleteTrainer = async (id) => {
  try {
    const response = await api.delete(`/trainer/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get All Inquiries
const getInquiries = async () => {
  try {
    const response = await api.get("/inquiry/list");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Inquiry By ID
const getInquiryById = async (id) => {
  try {
    const response = await api.get(`/inquiry/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update Inquiry
const updateInquiry = async (id, inquiryData) => {
  try {
    const response = await api.put(`/inquiry/${id}`, inquiryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete Inquiry
const deleteInquiry = async (id) => {
  try {
    const response = await api.delete(`/inquiry/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Search Inquiries
const searchInquiries = async (search) => {
  try {
    const response = await api.get("/inquiry/search", {
      params: { search },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Filter Inquiries
const filterInquiries = async (status, subject) => {
  try {
    const response = await api.get("/inquiry/filter", {
      params: { status, subject },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const value = {
  admin,
  isAuthenticated,
  loading,
  login,
  logout,

  addMembership,
  getMemberships,
  deleteMembership,
  getMembershipById,
  updateMembership,

  getMembers,
  deleteMember,
  addMember,
  getMemberById,
  updateMember,

  // Trainer APIs
  getTrainers,
  addTrainer,
  getTrainerById,
  updateTrainer,
  deleteTrainer,

  //Inquiries 
  getInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
  searchInquiries,
  filterInquiries,
};

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;