export const checkRecruiterApproval = (req, res, next) => {
  if (req.user.role === "recruiter" && !req.user.isApproved) {
    res.status(403);
    throw new Error("Recruiter not approved yet");
  }
  next();
};