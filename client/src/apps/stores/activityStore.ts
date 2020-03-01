import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../Models/Activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
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
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.split('T')[0];
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
        this.activity = activity;
        this.submitting = false;
      });
    } catch (e) {
      runInAction('edit activity error', () => {
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
  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.detail(id);
        runInAction('get activity', () => {
          this.activity = activity;
          this.loadingInitial = false;
        });
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

export default createContext(new ActivityStore());
