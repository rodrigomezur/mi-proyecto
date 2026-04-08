import { getMyProjects } from '@/app/actions'
import ProjectsClient from './projects-client'

export const metadata = { title: 'Projects — Creatiq' }

export default async function ProjectsPage() {
  const projects = await getMyProjects()

  return <ProjectsClient initialProjects={projects} />
}
