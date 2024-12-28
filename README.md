

# Kalbela Jobs Backend

Welcome to Kalbela Jobs Backend! This project serves as the backend for the Kalbela Jobs application, providing essential functionalities for job management, user authentication, and more.

## Contributors

- [Md. Mahadi Hasan](https://github.com/codewithmahadihasan)


## Folder Structure

```
kalbela_job_backend/
│
├── package.json        # Project metadata and dependencies
├── index.js            # Entry point of the application
├── index.html          # Frontend HTML file (if applicable)
│
├── modules/            # Contains modules for different roles
│   ├── admin/          # Admin module
│   │   ├── router/     # Router for admin module
│   │   └── modules/    # Sub-modules specific to admin
│   │
│   ├── employer/       # Employer module
│   │   ├── router/     # Router for employer module
│   │   └── modules/    # Sub-modules specific to employer
│   │
│   ├── jobseeker/      # Jobseeker module
│   │   ├── router/     # Router for jobseeker module
│   │   └── modules/    # Sub-modules specific to jobseeker
│   │
│   └── user/           # User module
│       ├── router/     # Router for user module
│       └── modules/    # Sub-modules specific to user
│
└── collection/         # Collection data for different roles
    ├── admin/          # Admin collection data
    ├── employer/       # Employer collection data
    ├── jobseeker/      # Jobseeker collection data
    └── user/           # User collection data
```

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/codewithmahadihasan/kalbela_job_backend.git
   ```

2. **Install dependencies:**

   ```bash
   cd kalbela_job_backend
   npm install
   ```

3. **Start the server:**

   ```bash
   npm start
   nodemon
   ```

## Contributing

We welcome contributions from the community. If you'd like to contribute to Kalbela Jobs Backend, please follow these guidelines:

- Fork the repository
- Create your feature branch (`git checkout -b feature/your-feature`)
- Commit your changes (`git commit -am 'Add some feature'`)
- Push to the branch (`git push origin feature/your-feature`)
- Create a new Pull Request

## License

This project is licensed under the [BFS](https://www.brightfuturesoft.com/) License.

---

### Deployment Instructions

If you update the collections in the backend, use the following command to sync them to the server:

```bash
scp -r collection munna@120.50.6.15:/var/www/kalbela_jobs_backend
```

**Password**: `boss2024`

---
