// Reference the input fields and fetch button
const bearerTokenInput = document.getElementById('bearerToken');
const envIdInput = document.getElementById('envId');
const fetchButton = document.getElementById('fetchButton');
const errorContainer = document.getElementById('errorContainer');
const resultsContainer = document.getElementById('resultsContainer');

// Function to format file sizes
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to fetch and display assets data
function fetchAllUserData() {
    // Get current values from input fields
    const envId = envIdInput.value.trim();
    const bearerToken = bearerTokenInput.value.trim();

    // Validate inputs
    if (!envId || !bearerToken) {
        errorContainer.textContent = 'Please enter both Environment ID and Management API Key';
        return;
    }

    // Clear previous results and errors
    resultsContainer.innerHTML = '<p>Loading...</p>';
    errorContainer.textContent = '';

    const apiUrl = `https://manage.kontent.ai/v2/projects/${envId}/assets`;

    // Make the API request
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Process the assets data
        const assets = data.assets || [];
        
        // Categorize assets
        const categorizedAssets = {
            allMatch: [],
            sizeAndTypeMatch: [],
            sizeOrNameMatch: []
        };

        // Create a map to track assets by size and type
        const sizeTypeMap = {};
        assets.forEach(asset => {
            const key = `${asset.size}-${asset.type}`;
            if (!sizeTypeMap[key]) {
                sizeTypeMap[key] = [];
            }
            sizeTypeMap[key].push(asset);
        });

        // Evaluate each group in the sizeTypeMap
        for (const key in sizeTypeMap) {
            const group = sizeTypeMap[key];
            const uniqueFileNames = new Set(group.map(a => a.file_name));

            if (group.every(a => a.file_name === group[0].file_name) && group.length > 1) {
                categorizedAssets.allMatch.push(...group);
            } else if (uniqueFileNames.size > 1) {
                categorizedAssets.sizeAndTypeMatch.push(...group);
            }
        }

        // Display results
        displayResults(categorizedAssets);
    })
    .catch(error => {
        console.error('Error:', error);
        errorContainer.textContent = `Error: ${error.message}`;
        resultsContainer.innerHTML = '';
    });
}

// Function to display results
function displayResults(categorizedAssets) {
    resultsContainer.innerHTML = '';

    const columns = [
        { className: 'allMatch', title: 'Matches File Name, Size, and Type' },
        { className: 'sizeAndTypeMatch', title: 'Matches Size and Type' },
        { className: 'sizeOrNameMatch', title: 'Matches Size or File Name' }
    ];

    columns.forEach(column => {
        const columnDiv = document.createElement('div');
        columnDiv.className = `column ${column.className}`;
        columnDiv.style.border = '1px solid #ddd';
        columnDiv.style.borderRadius = '5px';
        columnDiv.style.padding = '10px';
        columnDiv.style.margin = '10px';

        const header = document.createElement('h3');
        header.innerText = column.title;
        columnDiv.appendChild(header);

        const assets = categorizedAssets[column.className];
        if (assets.length > 0) {
            assets.forEach(asset => {
                const assetRow = document.createElement('div');
                assetRow.className = 'asset-row';
                assetRow.innerHTML = `
                    <a href="${asset.url}" target="_blank" class="kontent-asset-link" title="${asset.file_name}">
                        ${asset.file_name} - ${formatFileSize(asset.size)}
                    </a>
                `;
                columnDiv.appendChild(assetRow);

                const hr = document.createElement('hr');
                hr.style.margin = '10px 0';
                columnDiv.appendChild(hr);
            });
        } else {
            const noAssets = document.createElement('p');
            noAssets.textContent = 'No assets found in this category';
            columnDiv.appendChild(noAssets);
        }

        resultsContainer.appendChild(columnDiv);
    });
}

// Add event listener for the fetch button
fetchButton.addEventListener('click', (event) => {
    event.preventDefault();
    fetchAllUserData();
});