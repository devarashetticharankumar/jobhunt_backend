const cron = require("node-cron");
const nodemailer = require("nodemailer");

// Simple matching algorithm
const isMatch = (job, sub) => {
    if (!job.jobTitle || !sub.jobRole) return false;

    // Check title match (partial)
    const titleMatch = job.jobTitle.toLowerCase().includes(sub.jobRole.toLowerCase());

    // Check skills match (intersection)
    const subSkills = sub.skills.map(s => s.toLowerCase());
    const jobSkills = job.skills ? job.skills.map(s => s.label.toLowerCase()) : [];
    const skillMatch = subSkills.some(s => jobSkills.includes(s));

    return titleMatch || skillMatch;
};

const setupJobAlerts = (db) => {
    console.log("Initializing Job Alert Cron System...");

    // Run every day at 9:00 AM
    cron.schedule("0 9 * * *", async () => {
        console.log("Running Daily Job Alert Check...");

        try {
            const jobsCollection = db.collection("demoJobs");
            const subsCollection = db.collection("JobAlertSubscriptions");

            // Find jobs created in the last 24 hours
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const newJobs = await jobsCollection.find({
                createdAt: { $gte: yesterday.toISOString() } // Assuming createdAt is stored as ISO string
            }).toArray();

            if (newJobs.length === 0) {
                console.log("No new jobs found today.");
                return;
            }

            // Get all subscriptions
            const subscriptions = await subsCollection.find({}).toArray();

            // Configure Transporter (Reuse existing env vars)
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            // Process each subscription
            for (const sub of subscriptions) {
                const matchingJobs = newJobs.filter(job => isMatch(job, sub));

                if (matchingJobs.length > 0) {
                    console.log(`Sending alert to ${sub.email} for ${matchingJobs.length} jobs.`);

                    const jobListHtml = matchingJobs.map(job => `
                        <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                            <h3><a href="https://jobnirvana.netlify.app/job/${job._id}">${job.jobTitle}</a></h3>
                            <p><strong>${job.companyName}</strong> - ${job.jobLocation}</p>
                            <p>Salary: ${job.minPrice}-${job.maxPrice}k</p>
                        </div>
                    `).join("");

                    const mailOptions = {
                        from: process.env.EMAIL_USERNAME,
                        to: sub.email,
                        subject: `Job Alert: ${matchingJobs.length} new jobs found for ${sub.jobRole}`,
                        html: `
                            <h2>New Jobs for you!</h2>
                            <p>We found the following jobs matching your alert for <b>${sub.jobRole}</b>:</p>
                            ${jobListHtml}
                            <br/>
                            <p>Good luck!<br/>JobNirvana Team</p>
                        `
                    };

                    // Send email (handling errors individually)
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) console.error(`Failed to send email to ${sub.email}:`, err);
                        else console.log(`Email sent to ${sub.email}: ${info.response}`);
                    });
                }
            }

        } catch (error) {
            console.error("Error in Job Alert Cron:", error);
        }
    });
};

module.exports = setupJobAlerts;
