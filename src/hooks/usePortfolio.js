import { useSelector, useDispatch } from 'react-redux'
import {
  updateProfile,
  addSkill,
  removeSkill,
  addProject,
  updateProject,
  removeProject,
  updateSocialLinks,
  fetchPortfolio,
  fetchProfile,
  fetchSkills,
  fetchProjects,
  fetchProjectById,
  fetchSocialLinks,
  clearError
} from '../store/slices/portfolioSlice'

export const usePortfolio = () => {
  const dispatch = useDispatch()
  const portfolio = useSelector(state => state.portfolio)

  return {
    portfolio,
    // Update actions
    updateProfile: (data) => dispatch(updateProfile(data)),
    addSkill: (skill) => dispatch(addSkill(skill)),
    removeSkill: (skill) => dispatch(removeSkill(skill)),
    addProject: (project) => dispatch(addProject(project)),
    updateProject: (project) => dispatch(updateProject(project)),
    removeProject: (projectId) => dispatch(removeProject(projectId)),
    updateSocialLinks: (links) => dispatch(updateSocialLinks(links)),
    clearError: () => dispatch(clearError()),
    // Fetch actions (GET API calls)
    fetchPortfolio: () => dispatch(fetchPortfolio()),
    fetchProfile: () => dispatch(fetchProfile()),
    fetchSkills: () => dispatch(fetchSkills()),
    fetchProjects: () => dispatch(fetchProjects()),
    fetchProjectById: (projectId) => dispatch(fetchProjectById(projectId)),
    fetchSocialLinks: () => dispatch(fetchSocialLinks())
  }
}

