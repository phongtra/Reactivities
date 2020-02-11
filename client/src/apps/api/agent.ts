import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../Models/Activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>(resolve =>
    setTimeout(() => resolve(response), ms)
  );

const responseBody = (response: AxiosResponse) => response.data;
const request = {
  get: (url: string) =>
    axios
      .get(url)
      .then(sleep(1000))
      .then(responseBody),
  post: (url: string, body: {}) =>
    axios
      .post(url, body)
      .then(sleep(1000))
      .then(responseBody),
  put: (url: string, body: {}) =>
    axios
      .put(url, body)
      .then(sleep(1000))
      .then(responseBody),
  del: (url: string) =>
    axios
      .delete(url)
      .then(sleep(1000))
      .then(responseBody)
};

const Activities = {
  list: (): Promise<IActivity[]> => request.get('/activities'),
  detail: (id: string): Promise<IActivity> => request.get(`/activities/${id}`),
  create: (activity: IActivity) => request.post('/activities', activity),
  update: (activity: IActivity, id: string) =>
    request.put(`/activities/${id}`, activity),
  delete: (id: string) => request.del(`/activities/${id}`)
};

export default { Activities };
