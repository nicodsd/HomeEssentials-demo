export default async function axiosWrapper(urlOrConfig, maybeConfig = {}) {
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
