import Member from "../models/member.model.js";
import Trainer from "../models/trainer.model.js";
import Membership from "../models/membership.model.js";
import Inquiry from "../models/inquiry.model.js";

// Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const currentDate = new Date();

    // Current Month Date Range
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const startOfNextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );

    // Last 12 Months Date Range
    const startOf12Months = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 11,
      1
    );

    // Run All Queries Together
    const [
      totalMembers,
      activeMembers,
      expiredMembers,
      totalTrainers,
      activeTrainers,
      totalMemberships,
      activeMemberships,
      totalInquiries,
      pendingInquiries,
      contactedInquiries,
      resolvedInquiries,
      monthlyJoinedMembers,
      recentMembers,
      recentInquiries,
      monthlyMemberStats,
    ] = await Promise.all([

      // Members
      Member.countDocuments(),

      Member.countDocuments({ status: "Active" }),

      Member.countDocuments({ status: "Expired" }),

      // Trainers
      Trainer.countDocuments(),

      Trainer.countDocuments({ status: "Active" }),

      // Memberships
      Membership.countDocuments(),

      Membership.countDocuments({ status: "Active" }),

      // Inquiries
      Inquiry.countDocuments(),

      Inquiry.countDocuments({ status: "Pending" }),

      Inquiry.countDocuments({ status: "Contacted" }),

      Inquiry.countDocuments({ status: "Resolved" }),

      // Members Joined This Month
      Member.find({
        joinDate: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      }).populate("membership", "name month price"),

      // Recent Members
      Member.find()
        .populate("membership", "name month price")
        .sort({ createdAt: -1 })
        .limit(5),

      // Recent Inquiries
      Inquiry.find()
        .sort({ createdAt: -1 })
        .limit(5),

      // Monthly Member Statistics (Last 12 Months)
      Member.aggregate([
        {
          $match: {
            joinDate: {
              $gte: startOf12Months,
              $lt: startOfNextMonth,
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$joinDate" },
              month: { $month: "$joinDate" },
            },
            members: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Calculate Monthly Membership Value
    const monthlyRevenue = monthlyJoinedMembers.reduce(
      (total, member) => {
        return total + (member.membership?.price || 0);
      },
      0
    );

    // Prepare Membership Overview for Last 12 Months
    const membershipOverview = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const found = monthlyMemberStats.find(
        (item) =>
          item._id.year === year &&
          item._id.month === month
      );

      membershipOverview.push({
        month: date.toLocaleString("en-US", {
          month: "short",
        }),
        members: found ? found.members : 0,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully.",

      dashboard: {
        members: {
          total: totalMembers,
          active: activeMembers,
          expired: expiredMembers,
          joinedThisMonth: monthlyJoinedMembers.length,
        },

        trainers: {
          total: totalTrainers,
          active: activeTrainers,
        },

        memberships: {
          total: totalMemberships,
          active: activeMemberships,
        },

        inquiries: {
          total: totalInquiries,
          pending: pendingInquiries,
          contacted: contactedInquiries,
          resolved: resolvedInquiries,
        },

        revenue: {
          monthlyMembershipValue: monthlyRevenue,
        },

        membershipOverview,

        recentMembers,
        recentInquiries,
      },
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics.",
    });
  }
};