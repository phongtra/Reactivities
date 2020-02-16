import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../Models/Activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
  @observable loadingInitial = false;
  @observable selectedActivity: IActivity | undefined;
  @observable editMode = false;
  @observable submitting = false;
  @observable activityRegistry = new Map<string, IActivity>();
  @observable target = '';

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }
  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
  };
  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('create activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submitting = false;
      });
    } catch (e) {
      runInAction('create activity error', () => {
        console.log(e);
        this.submitting = false;
      });
    }
  };
  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity, activity.id);
      runInAction('edit activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (e) {
      runInAction('edit activity error', () => {
        this.editMode = false;
        this.submitting = false;
        console.log(e);
      });
    }
  };
  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };
  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  };
  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };
  @action cancelFormOpen = () => {
    this.editMode = false;
  };
  @action deleteActivity = async (
    id: string,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    this.submitting = true;
    this.target = e.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction('delete activity', () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (e) {
      runInAction('delete activity error', () => {
        this.submitting = false;
        this.target = '';
        console.log(e);
      });
    }
  };
  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities', () => {
        activities.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (e) {
      runInAction('load activities errors', () => {
        console.log(e);
        this.loadingInitial = false;
      });
    }
  };
}

export default createContext(new ActivityStore());
