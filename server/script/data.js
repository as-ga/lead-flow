// 3. Define your seed data

// status = new, contacted, qualified, lost
// source = website, instagram, referral

export const seedLeads = [
  {
    name: "John Doe",
    email: "jons.doe@gmail.com",
    status: "new",
    source: "website",
    remarks: "Interested in product A",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@gmail.com",
    status: "contacted",
    source: "instagram",
    remarks: "Requested a demo",
  },
  {
    name: "Bob Johnson",
    email: "bobhsj@hsjs.com",
    status: "qualified",
    source: "referral",
    remarks: "Looking for a long-term solution",
  },
  {
    name: "Alice Williams",
    email: "nssmak@jdk.sj",
    status: "lost",
    source: "website",
    remarks: "Decided to go with a competitor",
  },
];
