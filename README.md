# 🧩 Asset Duplicate Finder

A web application that helps identify duplicate assets in your **Kontent.ai** asset library using the **Management API (MAPI)**.

---

## 📐 Code Specification

### 🖼️ Frontend Structure

#### HTML (`index.html`)
- Single-page application (SPA) with a clean, responsive layout.
- Input fields:
  - **Environment ID**
  - **Management API Key** (password-type input)
- Results display area with **three categorized columns**.
- Pastel-colored UI for visual clarity and grouping.

---

### 🧠 JavaScript Functionality (`index.js`)

#### 1. Asset Data Fetching
- Connects to **Kontent.ai Management API**.
- Authenticates using the provided **Environment ID** and **API Key**.
- Fetches all assets from the specified project using pagination (if needed).

#### 2. Duplicate Detection Logic
Assets are categorized into three groups:
- **`allMatch`**: Identical file name, size, and type.
- **`sizeAndTypeMatch`**: Same size and type, different name.
- **`sizeOrNameMatch`**: Same size or name, but not both.

#### 3. Data Processing
- Formats file sizes for readability (e.g., KB, MB).
- Groups assets based on shared properties.
- Identifies potential duplicates using multi-criteria logic.

#### 4. Results Display
- Results are shown in **three pastel-colored columns**:
  - **All Match**: Soft pink `#FFE5E5`
  - **Size and Type Match**: Soft blue `#E5F4FF`
  - **Size or Name Match**: Soft green `#E5FFE5`
- Each asset entry includes:
  - File name
  - File size
  - Clickable link to view the asset in **Kontent.ai**

---

### ⚠️ Error Handling
- Validates input fields before API calls.
- Handles:
  - Authentication errors
  - Network issues
  - Empty or malformed responses
- Displays user-friendly error messages.
- Shows loading indicators during API calls.

---

### 🔐 Security Features
- API Key input is masked (password field).
- No local storage or caching of sensitive data.
- API credentials are used only in-session and not persisted.

---

### ✅ Benefits
- Helps content managers **identify and manage duplicate assets**.
- Improves **asset organization** and reduces **storage usage**.
- Enhances **content governance** in Kontent.ai projects.
