// Reference the input fields and fetch button
const bearerTokenInput = document.getElementById('bearerToken');
const envIdInput = document.getElementById('envId');
const fetchButton = document.getElementById('fetchButton');
const errorContainer = document.getElementById('errorContainer');

// Create a container to display the asset list
const assetContainer = document.createElement('div');
assetContainer.id = 'assetContainer';
document.body.appendChild(assetContainer);

let continuationToken = null;

// First, the helper function for formatting file sizes
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Then the table creation function
function createAssetTable(assets, duplicates) {
  const table = document.createElement('table');
  
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>File Name</th>
      <th>Size</th>
      <th>Folder</th>
      <th>Actions</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  assets.forEach(asset => {
    const row = document.createElement('tr');
    
    // Check if this asset is a duplicate
    const isDuplicate = duplicates.some(d => 
      d.file_name === asset.file_name && d.size === asset.size
    );
    
    if (isDuplicate) {
      row.classList.add('duplicate');
    }

    // Add data attributes for highlighting
    row.setAttribute('data-filename', asset.file_name);
    row.setAttribute('data-size', asset.size);

    const kontentUrl = `https://app.kontent.ai/3d9382a3-34fd-00bc-821b-4b6325e1e0f6/content-inventory/assets/asset/${asset.id}`;

    row.innerHTML = `
      <td>
        <a href="${kontentUrl}" target="_blank" class="kontent-asset-link">
          ${asset.file_name}
        </a>
      </td>
      <td>${formatFileSize(asset.size)}</td>
      <td>${asset.foldId}</td>
      <td class="actions">
        <button class="btn-small" onclick="window.open('${kontentUrl}', '_blank')">View</button>
        ${isDuplicate ? `<button class="btn-small btn-delete delete-btn" data-asset-id="${asset.id}">Delete</button>` : ''}
      </td>
    `;
    
    // Add click handler for highlighting duplicates
    row.addEventListener('click', (e) => {
      // Don't trigger if clicking on buttons or links
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
      
      // Remove existing highlights
      document.querySelectorAll('.highlight-duplicate').forEach(r => {
        r.classList.remove('highlight-duplicate');
      });

      // Find and highlight all duplicates of this file
      const filename = asset.file_name;
      const size = asset.size;
      
      // Find all assets with the same name and size
      const duplicatesOfThis = assets.filter(a => 
        a.file_name === filename && a.size === size
      );

      if (duplicatesOfThis.length > 1) {
        // Highlight all matching rows
        document.querySelectorAll(`tr[data-filename="${filename}"][data-size="${size}"]`).forEach(r => {
          r.classList.add('highlight-duplicate');
        });
      }
    });
    
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  return table;
}

// Hardcoded environment ID and API key for testing
const envId = 'd4e573a8-c3d6-00a9-373b-250d12f0ba1e';
const bearerToken = 'exxx';

console.log('Environment ID:', envId);
console.log('Bearer Token:', bearerToken);

// Function to fetch and display assets data
function fetchAllUserData() {
    const extractedData = [];
    const apiUrl = `https://manage.kontent.ai/v2/projects/${envId}/assets`; // API endpoint
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<p>Loading...</p>'; // Loading message

    // Recursive function to fetch data until there's no more pagination token
    function fetchPageOfData() {
        const url = `${apiUrl}`; // API request URL

        // Headers for the request
        const headers = {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
        };

        fetch(url, {
            method: 'GET',
            headers: headers,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`); // Handle errors
            }
            return response.json(); // Parse JSON response
        })
        .then((data) => {
            const jsonData = data;

            // Collect asset data
            jsonData.assets.forEach((asset) => {
                const file_name = asset.file_name;
                const size = asset.size; // Size in bytes
                const type = asset.type; // e.g., "image/png"
                const url = asset.url; // URL to the asset

                // Store asset data
                extractedData.push({
                    file_name,
                    size,
                    type,
                    url,
                });
            });

            // Categorization logic here...
            const categorizedAssets = {
                allMatch: [],
                sizeAndTypeMatch: [],
                sizeOrNameMatch: []
            };

            // Create a map to track assets by size and type
            const sizeTypeMap = {};

            extractedData.forEach(asset => {
                const key = `${asset.size}-${asset.type}`; // Key based on size and type
                if (!sizeTypeMap[key]) {
                    sizeTypeMap[key] = [];
                }
                sizeTypeMap[key].push(asset);
            });

            // Evaluate each group in the sizeTypeMap
            for (const key in sizeTypeMap) {
                const group = sizeTypeMap[key];
                const uniqueFileNames = new Set(group.map(a => a.file_name)); // Track unique file names

                // Check for allMatch
                const allMatch = group.every(a => a.file_name === group[0].file_name);
                if (allMatch && group.length > 1) { // Ensure there are duplicates
                    categorizedAssets.allMatch.push(...group);
                } else if (uniqueFileNames.size > 1) { // Check if there are different file names
                    // If there are multiple assets with the same size and type but different names
                    categorizedAssets.sizeAndTypeMatch.push(...group);
                }
            }

            // Check for sizeOrNameMatch
            const sizeOrNameMap = {};
            extractedData.forEach(asset => {
                const key = `${asset.size}-${asset.file_name}`; // Key based on size and file name
                if (!sizeOrNameMap[key]) {
                    sizeOrNameMap[key] = [];
                }
                sizeOrNameMap[key].push(asset);
            });

            for (const key in sizeOrNameMap) {
                const group = sizeOrNameMap[key];
                if (group.length > 1) { // Only include if there are duplicates
                    categorizedAssets.sizeOrNameMatch.push(...group);
                }
            }

            // Clear previous results
            resultsContainer.innerHTML = ''; 

            // Create columns for each category
            const columns = [
                { className: 'allMatch', title: 'Matches File Name, Size, and Type' },
                { className: 'sizeAndTypeMatch', title: 'Matches Size and Type' },
                { className: 'sizeOrNameMatch', title: 'Matches Size or File Name' }
            ];

            columns.forEach(column => {
                const columnDiv = document.createElement('div');
                columnDiv.className = `column ${column.className}`;
                columnDiv.style.border = '1px solid #ddd'; // Add border
                columnDiv.style.borderRadius = '5px'; // Rounded corners
                columnDiv.style.padding = '10px'; // Padding
                columnDiv.style.margin = '10px'; // Margin

                // Create and center the header
                const header = document.createElement('h3');
                header.innerText = column.title;
                header.style.textAlign = 'center'; // Center the text
                columnDiv.appendChild(header);

                // Append categorized assets to the column
                const assets = categorizedAssets[column.className];
                if (assets.length > 0) {
                    assets.forEach((asset) => {
                        const assetRow = document.createElement('div');
                        assetRow.className = 'asset-row';
                        assetRow.innerHTML = `
                            <a href="${asset.url}" target="_blank" class="kontent-asset-link" title="${asset.file_name}">
                                ${asset.file_name} - ${formatFileSize(asset.size)}
                            </a>
                        `;
                        columnDiv.appendChild(assetRow);

                        // Add a horizontal line after each asset
                        const hr = document.createElement('hr');
                        hr.style.margin = '10px 0'; // Add some margin
                        columnDiv.appendChild(hr);
                    });
                }

                resultsContainer.appendChild(columnDiv);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`; // Show error message
        });
    }

    // Start fetching data
    fetchPageOfData();
}

// Event listener for the button click
document.getElementById('fetchButton').addEventListener('click', (event) => {
    event.preventDefault();
    fetchAllUserData();
});

// Add this function after the fetchAllUserData function
function deleteAsset(assetId) {
  const envId = envIdInput.value;
  const bearerToken = bearerTokenInput.value;
  
  fetch(`https://manage.kontent.ai/v2/projects/${envId}/assets/${assetId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Refresh the asset list after successful deletion
    fetchAllUserData();
  })
  .catch(error => {
    console.error('Error:', error);
    errorContainer.textContent = `Error deleting asset: ${error.message}`;
  });
}

// Add event delegation for delete buttons
document.getElementById('resultsContainer').addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-btn')) {
    const assetId = event.target.dataset.assetId;
    if (confirm('Are you sure you want to delete this asset?')) {
      deleteAsset(assetId);
    }
  }
});

// Add some CSS for the delete button
const style = document.createElement('style');
style.textContent = `
  .delete-btn {
    margin-left: 10px;
    padding: 4px 8px;
    background-color: #ff4444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .delete-btn:hover {
    background-color: #cc0000;
  }
`;
document.head.appendChild(style);

// Update the CSS styles
const duplicateStyles = document.createElement('style');
duplicateStyles.textContent = `
  .duplicate-flag {
    color: #ff0000;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    margin-left: 8px;
  }
  
  .duplicate-row {
    background-color: #fff0f0;
  }
  
  .duplicate-row:hover {
    background-color: #ffe0e0 !important;
  }
`;
document.head.appendChild(duplicateStyles);

// Add these styles to your existing styles
const highlightStyles = document.createElement('style');
highlightStyles.textContent = `
  .highlight-duplicate {
    background-color: #fff3f3 !important;
  }
  
  tr[data-filename] {
    cursor: pointer;
  }
`;
document.head.appendChild(highlightStyles);
