import os
import re

files_to_update = [
    'src/assets/pages/AdminPanel.jsx',
    'src/assets/pages/Cart.jsx',
    'src/assets/pages/Contact.jsx',
    'src/assets/pages/Home.jsx',
    'src/assets/pages/UserPanel.jsx',
    'src/assets/pages/Signin.jsx',
    'src/assets/pages/Signup.jsx',
    'src/assets/pages/FormCV.jsx',
    'src/assets/pages/CategoryDetail.jsx',
    'src/pages/AdminComponents/Orders.jsx',
    'src/pages/AdminComponents/ProductsAdmin.jsx',
    'src/assets/components/Products/ProductDetail.jsx',
    'src/assets/components/Products/AllProducts.jsx',
    'src/assets/components/Navigation/FloatingNavBar.jsx',
    'src/assets/components/Navigation/SearchAndLogoNavbar.jsx',
    'src/assets/components/Navigation/Favourites.jsx',
    'src/assets/components/Navigation/Carrito.jsx',
    'src/assets/components/HomeIndex/HomeRecommended.jsx',
    'src/assets/components/HomeIndex/HomeNewArrivals.jsx'
]

base_dir = r"c:\Users\Nicolas\REPOS git\HomeEssentials-demo"

for file_path in files_to_update:
    full_path = os.path.join(base_dir, file_path)
    if not os.path.exists(full_path):
        continue
        
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove import axios
    content = re.sub(r'import axios from [\'"]axios[\'"];?\n?', '', content)

    # 1. axios.get(url, config) -> fetch(url, config).then(res => res.json())
    # 2. axios.post(url, data, config) -> fetch(url, { ...config, method: 'POST', body: JSON.stringify(data) })
    # 3. axios(url) -> fetch(url)
    # 4. res.data -> res
    # 5. err.response?.data?.message -> err.message (if needed)

    # This is a bit complex for simple regex. We will use a wrapper approach which is much cleaner and safer for the React app.
    # The wrapper approach provides exact axios compatibility using fetch.

with open(os.path.join(base_dir, 'src', 'utils', 'fetchWrapper.js'), 'w', encoding='utf-8') as f:
    f.write("""export default async function axiosWrapper(urlOrConfig, maybeConfig = {}) {
  let url = typeof urlOrConfig === 'string' ? urlOrConfig : urlOrConfig.url;
  let config = typeof urlOrConfig === 'string' ? maybeConfig : urlOrConfig;

  let fetchConfig = {
    method: config.method || 'GET',
    headers: { ...config.headers }
  };

  if (config.data) {
    fetchConfig.body = JSON.stringify(config.data);
    if (!fetchConfig.headers['Content-Type']) {
      fetchConfig.headers['Content-Type'] = 'application/json';
    }
  }

  const response = await fetch(url, fetchConfig);
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }
  
  const axiosResponse = {
    data: data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: config
  };

  if (!response.ok) {
    let err = new Error('Request failed with status code ' + response.status);
    err.response = axiosResponse;
    throw err;
  }
  return axiosResponse;
}

axiosWrapper.get = (url, config = {}) => axiosWrapper({ ...config, method: 'GET', url });
axiosWrapper.post = (url, data, config = {}) => axiosWrapper({ ...config, method: 'POST', url, data });
axiosWrapper.put = (url, data, config = {}) => axiosWrapper({ ...config, method: 'PUT', url, data });
axiosWrapper.delete = (url, config = {}) => axiosWrapper({ ...config, method: 'DELETE', url });
""")

# Now update all files to use the wrapper
for file_path in files_to_update:
    full_path = os.path.join(base_dir, file_path)
    if not os.path.exists(full_path):
        continue
        
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'axios' in content:
        # Calculate relative path to src/utils/fetchWrapper.js
        depth = file_path.count('/') - 1
        rel_prefix = '../' * depth if depth > 0 else './'
        if depth == 0 and not file_path.startswith('src/'):
            pass # Handle root if any
            
        import_stmt = f"import axios from '{rel_prefix}utils/fetchWrapper.js';"
        
        # Replace axios import
        content = re.sub(r'import axios from [\'"]axios[\'"];?', import_stmt, content)
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
