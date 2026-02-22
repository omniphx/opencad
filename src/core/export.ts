import { Project, ComponentTemplate } from '../types';

export interface OpenCADExport {
  version: 1;
  exportedAt: string;
  project: Project;
  components: ComponentTemplate[];
}

export function exportProject(
  project: Project,
  components: ComponentTemplate[],
): void {
  const data: OpenCADExport = {
    version: 1,
    exportedAt: new Date().toISOString(),
    project,
    components,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.opencad.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
