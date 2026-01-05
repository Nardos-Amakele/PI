import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { patientsApi } from "../services/patients/patientsApi";
import { authApi } from "../services/auth/authApi";
import { serviceApi } from "../services/services/serviceApi";
import { providersApi } from "../services/providers/providersApi";
import { referralsApi } from "../services/referrals/referralsApi";
import { blockReasonsApi } from "../services/blockReasons/reasonsApi";
import { locationsApi } from "../services/locations/locationsApi";
import { appointmentTypesApi } from "../services/appointmentTypes/appointmentTypesApi";
import { schedulingApi } from "../services/scheduling/schedulingApi";
import { providerTemplatesApi } from "../services/providerTemplates/providerTemplatesApi";
import { documentClassificationApi } from "../services/documents/documentsApi";
import { casesApi } from "../services/cases/casesApi";

export const store = configureStore({
  reducer: {
    [patientsApi.reducerPath]: patientsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [providersApi.reducerPath]: providersApi.reducer,
    [referralsApi.reducerPath]: referralsApi.reducer,
    [blockReasonsApi.reducerPath]: blockReasonsApi.reducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
    [appointmentTypesApi.reducerPath]: appointmentTypesApi.reducer,
    [schedulingApi.reducerPath]: schedulingApi.reducer,
    [providerTemplatesApi.reducerPath]: providerTemplatesApi.reducer,
    [documentClassificationApi.reducerPath]: documentClassificationApi.reducer,
    [casesApi.reducerPath]: casesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(patientsApi.middleware)
      .concat(authApi.middleware)
      .concat(serviceApi.middleware)
      .concat(providersApi.middleware)
      .concat(referralsApi.middleware)
      .concat(blockReasonsApi.middleware)
      .concat(locationsApi.middleware)
      .concat(appointmentTypesApi.middleware)
      .concat(schedulingApi.middleware)
      .concat(providerTemplatesApi.middleware)
      .concat(documentClassificationApi.middleware)
      .concat(casesApi.middleware),
});

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
