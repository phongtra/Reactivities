import { observable, action, computed, runInAction } from 'mobx';
import { SyntheticEvent } from 'react';
import { IActivity } from '../Models/Activity';
import { history } from '../..';
import agent from '../api/agent';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable loadingInitial = false;
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable activityRegistry = new Map();
  @observable target = '';

  @computed get activitiesByDate() {
    return this.groupActivitiesDate(Array.from(this.activityRegistry.values()));
  }

  groupActivitiesDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('T')[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('create activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
        history.push(`/activities/${activity.id}`);
      });
    } catch (e) {
      runInAction('create activity error', () => {
        toast.error('Problem submitting data');
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
        this.activity = activity;
        this.submitting = false;
        history.push(`/activities/${activity.id}`);
      });
    } catch (e) {
      runInAction('edit activity error', () => {
        toast.error('Problem submitting data');
        this.submitting = false;
        console.log(e);
      });
    }
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
          activity.date = new Date(activity.date);
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
  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.detail(id);
        runInAction('get activity', () => {
          activity.date = new Date(activity.date);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (e) {
        runInAction('get activity error', () => {
          this.loadingInitial = false;
        });
        console.log(e);
      }
    }
  };
  @action clearActivity = () => {
    this.activity = null;
  };
  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };
}
