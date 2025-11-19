export interface HateoasLink {
  rel: string;
  href: string;
  method: string;
}

export interface HateoasResponse<T> {
  data: T;
  _links: HateoasLink[];
}

export class HateoasHelper {
  private static baseUrl = '/api';

  static addLinks<T>(data: T, links: HateoasLink[]): HateoasResponse<T> {
    return {
      data,
      _links: links,
    };
  }

  static taskLinks(taskId: string): HateoasLink[] {
    return [
      { rel: 'self', href: `${this.baseUrl}/tasks/${taskId}`, method: 'GET' },
      {
        rel: 'update',
        href: `${this.baseUrl}/tasks/${taskId}`,
        method: 'PUT',
      },
      {
        rel: 'delete',
        href: `${this.baseUrl}/tasks/${taskId}`,
        method: 'DELETE',
      },
      {
        rel: 'complete',
        href: `${this.baseUrl}/tasks/${taskId}/complete`,
        method: 'PATCH',
      },
      { rel: 'list', href: `${this.baseUrl}/tasks`, method: 'GET' },
    ];
  }

  static taskListLinks(): HateoasLink[] {
    return [
      { rel: 'self', href: `${this.baseUrl}/tasks`, method: 'GET' },
      { rel: 'create', href: `${this.baseUrl}/tasks`, method: 'POST' },
    ];
  }

  static userLinks(userId: string): HateoasLink[] {
    return [
      { rel: 'self', href: `${this.baseUrl}/users/${userId}`, method: 'GET' },
      {
        rel: 'progress',
        href: `${this.baseUrl}/users/${userId}/progress`,
        method: 'GET',
      },
      {
        rel: 'update',
        href: `${this.baseUrl}/users/me`,
        method: 'PUT',
      },
      {
        rel: 'delete',
        href: `${this.baseUrl}/users/${userId}`,
        method: 'DELETE',
      },
      { rel: 'list', href: `${this.baseUrl}/users`, method: 'GET' },
    ];
  }

  static userMeLinks(): HateoasLink[] {
    return [
      { rel: 'self', href: `${this.baseUrl}/users/me`, method: 'GET' },
      { rel: 'update', href: `${this.baseUrl}/users/me`, method: 'PUT' },
      {
        rel: 'tasks',
        href: `${this.baseUrl}/tasks`,
        method: 'GET',
      },
      {
        rel: 'badges',
        href: `${this.baseUrl}/badges`,
        method: 'GET',
      },
      {
        rel: 'challenges',
        href: `${this.baseUrl}/challenges`,
        method: 'GET',
      },
    ];
  }

  static challengeLinks(challengeId: string): HateoasLink[] {
    return [
      {
        rel: 'self',
        href: `${this.baseUrl}/challenges/${challengeId}`,
        method: 'GET',
      },
      {
        rel: 'complete',
        href: `${this.baseUrl}/challenges/${challengeId}/complete`,
        method: 'POST',
      },
      { rel: 'list', href: `${this.baseUrl}/challenges`, method: 'GET' },
    ];
  }

  static challengeListLinks(): HateoasLink[] {
    return [
      { rel: 'self', href: `${this.baseUrl}/challenges`, method: 'GET' },
      {
        rel: 'today',
        href: `${this.baseUrl}/challenges/today`,
        method: 'GET',
      },
    ];
  }

  static badgeListLinks(): HateoasLink[] {
    return [
      { rel: 'self', href: `${this.baseUrl}/badges`, method: 'GET' },
      { rel: 'profile', href: `${this.baseUrl}/users/me`, method: 'GET' },
    ];
  }

  static leaderboardLinks(): HateoasLink[] {
    return [
      { rel: 'self', href: `${this.baseUrl}/leaderboard`, method: 'GET' },
      { rel: 'profile', href: `${this.baseUrl}/users/me`, method: 'GET' },
    ];
  }

  static authLinks(): HateoasLink[] {
    return [
      { rel: 'login', href: `${this.baseUrl}/auth/login`, method: 'POST' },
      {
        rel: 'register',
        href: `${this.baseUrl}/auth/register`,
        method: 'POST',
      },
      { rel: 'profile', href: `${this.baseUrl}/users/me`, method: 'GET' },
    ];
  }
}
