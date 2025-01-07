

# Kalbela Jobs Backend

Welcome to Kalbela Jobs Backend! This project serves as the backend for the Kalbela Jobs application, providing essential functionalities for job management, user authentication, and more.

## Contributors

- [Md. Mahadi Hasan](https://github.com/codewithmahadihasan)


## Folder Structure

```
kalbela_job_backend/
│
├── package.json
├── index.js
├── index.html
│
├── modules/
│   ├── admin/
│   │   ├── router/
│   │   └── modules/
│   │
│   ├── employer/
│   │   ├── router/
│   │   └── modules/
│   │
│   ├── jobseeker/
│   │   ├── router/
│   │   └── modules/
│   │
│   └── user/
│       ├── router/
│       └── modules/
│
└── collection/
    └── uri.js
    └── collection/
        ├── auth.js
        ├── content.js
        ├── image_collection.js
        ├── system.js
        └── users_activity.js
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
scp -r collection munna@120.50.6.154:/var/www/kalbela_job_backend
```


```bash
scp -r modules munna@120.50.6.154:/var/www/kalbela_job_backend
```

```bash
scp -r routers munna@120.50.6.154:/var/www/kalbela_job_backend
```

**Password**: `contact with project manager`

---
