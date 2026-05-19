const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    let employer = await User.findOne({ role: { $regex: /employer/i } });
    
    if (!employer) {
      console.log('No employer found. Creating a dummy employer...');
      employer = await User.create({
        name: 'Tech Corp HR',
        email: 'hr@techcorp.com',
        password: 'password123',
        role: 'employer'
      });
    }

    const jobs = [
      {
        title: 'Senior Frontend Developer',
        company: 'InnovateTech',
        location: 'San Francisco, CA',
        salary: '$120,000 - $150,000',
        type: 'Remote',
        description: 'We are looking for an experienced React developer to lead our frontend team. Must have strong skills in React, Redux, and modern CSS.',
        employerId: employer._id
      },
      {
        title: 'Backend Node.js Engineer',
        company: 'CloudStream',
        location: 'Austin, TX',
        salary: '$110,000 - $140,000',
        type: 'Full-time',
        description: 'Join our scalable architecture team. You will be building microservices in Node.js and managing MongoDB clusters.',
        employerId: employer._id
      },
      {
        title: 'UI/UX Designer',
        company: 'Creative Solutions',
        location: 'New York, NY',
        salary: '$90,000 - $115,000',
        type: 'Contract',
        description: 'Design beautiful user interfaces for our growing list of SaaS products. Figma mastery required.',
        employerId: employer._id
      },
      {
        title: 'DevOps Engineer',
        company: 'DeployFast',
        location: 'Remote',
        salary: '$130,000 - $160,000',
        type: 'Remote',
        description: 'Manage our AWS infrastructure, CI/CD pipelines, and Kubernetes clusters. Strong Linux skills needed.',
        employerId: employer._id
      },
      {
        title: 'Data Scientist',
        company: 'DataMind',
        location: 'Seattle, WA',
        salary: '$140,000 - $180,000',
        type: 'Full-time',
        description: 'Work on cutting-edge machine learning models for predictive analytics. Python, PyTorch, and SQL required.',
        employerId: employer._id
      }
    ];

    await Job.insertMany(jobs);
    console.log(`✅ Successfully added ${jobs.length} realistic jobs to the database!`);
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding jobs:', err);
    mongoose.disconnect();
  }
};

seed();
