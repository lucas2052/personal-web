import axios from 'axios'

// The Spring Boot backend uses an HttpOnly session cookie for admin requests.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

// ---- Domain types (mirror the backend model classes) ----

export type PostType = 'BLOG' | 'PORTFOLIO'
export type PostStatus = 'DRAFT' | 'PUBLISHED'

export interface Post {
  id?: number
  title: string
  slug: string
  content: string
  coverImage?: string
  type: PostType
  status: PostStatus
  createdAt?: string
  updatedAt?: string
}

export interface Comment {
  id: number
  postId: number
  authorName: string
  body: string
  createdAt: string
}

export interface ImageItem {
  id?: number
  title: string
  url: string
  caption?: string
  createdAt?: string
}

export interface Link {
  id?: number
  label: string
  url: string
  sortOrder: number
}

export interface CustomUrl {
  label: string
  url: string
}

export interface Profile {
  id?: number
  name: string
  bio: string
  email: string
  location: string
  avatarUrl?: string
  urls: CustomUrl[]
}

// ---- Posts ----
export const listPosts = (type: PostType, includeDrafts = false) =>
  api.get<Post[]>('/api/posts', { params: { type, includeDrafts } }).then((r) => r.data)

export const getPost = (slug: string) =>
  api.get<Post>(`/api/posts/${slug}`).then((r) => r.data)

export const createPost = (post: Post) =>
  api.post<Post>('/api/posts', post).then((r) => r.data)

export const updatePost = (id: number, post: Post) =>
  api.put<Post>(`/api/posts/${id}`, post).then((r) => r.data)

export const deletePost = (id: number) => api.delete(`/api/posts/${id}`)

// ---- Comments ----
export const listComments = (postId: number) =>
  api.get<Comment[]>(`/api/posts/${postId}/comments`).then((r) => r.data)

// ---- Images ----
export const listImages = () =>
  api.get<ImageItem[]>('/api/images').then((r) => r.data)

export const createImage = (item: ImageItem) =>
  api.post<ImageItem>('/api/images', item).then((r) => r.data)

export const deleteImage = (id: number) => api.delete(`/api/images/${id}`)

// ---- Links ----
export const listLinks = () => api.get<Link[]>('/api/links').then((r) => r.data)

export const createLink = (link: Link) =>
  api.post<Link>('/api/links', link).then((r) => r.data)

export const updateLink = (id: number, link: Link) =>
  api.put<Link>(`/api/links/${id}`, link).then((r) => r.data)

export const deleteLink = (id: number) => api.delete(`/api/links/${id}`)

// ---- Profile ----
export const getProfile = () =>
  api.get<Profile>('/api/profile').then((r) => r.data)

export const updateProfile = (profile: Profile) =>
  api.put<Profile>('/api/profile', profile).then((r) => r.data)
