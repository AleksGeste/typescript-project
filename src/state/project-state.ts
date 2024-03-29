import {Project, ProjectStatus} from '../models/project';

// Project State Management
// Custom type - generic
type Listener<T> = (items: T[]) => void;

// Class with generic type
export class State<T> {
    // can be access from inference classes
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    // if instance created we return it if not creating new
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        );
        this.projects.push(newProject);
        this.updateListeners();
    }

    // move to different list
    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(pr => pr.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    // rerender
    private updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}

// global instance
export const projectState = ProjectState.getInstance();
