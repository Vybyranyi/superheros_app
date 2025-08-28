import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export interface ISuperhero {
  _id: string;
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string[];
  catch_phrase: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISuperheroList {
  _id: string;
  nickname: string;
  images: string[];
}

export interface SuperheroFormData {
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string[];
  catch_phrase: string;
  images: File[];
  imagesToRemove?: string[];
}

export interface SuperheroSlice {
  currentSuperhero: ISuperhero | null;
  superheroesList: ISuperheroList[] | null;
  loading: boolean;
  error: string | null;
  totalPages: number | null;
  currentPage: number | null;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
  superheroToEdit: ISuperhero | null;
}

export const initialState: SuperheroSlice = {
  currentSuperhero: null,
  superheroesList: [],
  loading: false,
  error: null,
  totalPages: null,
  currentPage: null,
  nextPageUrl: null,
  prevPageUrl: null,
  superheroToEdit: null
};

export const createSuperhero = createAsyncThunk(
  "superheros/create",
  async (superheroData: SuperheroFormData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(superheroData).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file) => formData.append("images", file));
        } else if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      const res = await fetch(`${API_URL}/superheroes/create`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.message || "failed to create superhero");
      }
      return data.superhero as ISuperhero;
    } catch {
      return rejectWithValue("Network error during superhero creation");
    }
  }
);

export const getAllSuperheroes = createAsyncThunk(
  "superheros/getAll",
  async (pageURL: string | null, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}${pageURL ? pageURL : "/superheroes/all"}`);
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.message || "failed to fetch superheroes");
      }
      return data;
    } catch {
      return rejectWithValue("Network error during fetching superheroes");
    }
  }
);

export const getByIdSuperhero = createAsyncThunk(
  "superheros/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/superheroes/${id}`);
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.message || "failed to fetch superhero");
      }
      return data as ISuperhero;
    } catch {
      return rejectWithValue("Network error during fetching superhero");
    }
  }
);

export const updateSuperhero = createAsyncThunk(
  "superheros/update",
  async (payload: { id: string; data: SuperheroFormData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(payload.data).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file) => formData.append("images", file));
        } else if (key === "imagesToRemove" && Array.isArray(value)) {
          formData.append("imagesToRemove", JSON.stringify(value));
        } else if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      const res = await fetch(`${API_URL}/superheroes/update/${payload.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.message || "failed to update superhero");
      }
      return data.superhero as ISuperhero;
    } catch {
      return rejectWithValue("Network error during superhero update");
    }
  }
);

export const deleteSuperhero = createAsyncThunk(
  "superheros/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/superheroes/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.message || "failed to delete superhero");
      }
      return { id };
    } catch {
      return rejectWithValue("Network error during superhero deletion");
    }
  }
);

const SuperheroSlice = createSlice({
  name: "superheros",
  initialState,
  reducers: {
    setSuperheroToEdit: (state, action) => {
      state.superheroToEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSuperhero.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.superheroesList) {
          state.superheroesList.unshift({
            _id: action.payload._id,
            nickname: action.payload.nickname,
            images: action.payload.images,
          });
        }
      })
      .addCase(createSuperhero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSuperhero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getAllSuperheroes.fulfilled, (state, action) => {
        state.superheroesList = action.payload.superheroes;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllSuperheroes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSuperheroes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getByIdSuperhero.fulfilled, (state, action) => {
        state.currentSuperhero = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getByIdSuperhero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getByIdSuperhero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateSuperhero.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.superheroesList) {
          state.superheroesList = state.superheroesList.map((s) =>
            s._id === action.payload._id
              ? { _id: action.payload._id, nickname: action.payload.nickname, images: action.payload.images }
              : s
          );
        }
        if (state.currentSuperhero && state.currentSuperhero._id === action.payload._id) {
          state.currentSuperhero = action.payload;
        }
      })
      .addCase(updateSuperhero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSuperhero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteSuperhero.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.superheroesList) {
          state.superheroesList = state.superheroesList.filter(
            (s) => s._id !== action.payload.id
          );
        }
        if (state.currentSuperhero && state.currentSuperhero._id === action.payload.id) {
          state.currentSuperhero = null;
        }
      })
      .addCase(deleteSuperhero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSuperhero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { setSuperheroToEdit } = SuperheroSlice.actions;
export default SuperheroSlice.reducer;
