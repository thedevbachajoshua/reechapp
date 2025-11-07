export const stats = [
    {
      id: 1,
      label: 'New Believers',
      value: '12',
      change: '+18.2% from last month',
    },
    {
      id: 2,
      label: 'Follow-ups Sent',
      value: '256',
      change: '+25% from last month',
    },
    {
      id: 3,
      label: 'Completion Rate',
      value: '85%',
      change: '+5.2% from last month',
    },
  ];
  
  export const activityData = [
    { date: 'Jan', FollowUps: 150 },
    { date: 'Feb', FollowUps: 180 },
    { date: 'Mar', FollowUps: 220 },
    { date: 'Apr', FollowUps: 200 },
    { date: 'May', FollowUps: 280 },
    { date: 'Jun', FollowUps: 310 },
  ];
  
  export const leaderboard = [
    { id: 1, name: 'Jane Doe', points: 1250, avatar: 'https://picsum.photos/seed/avatar1/40/40', uid: 'reacher-002' },
    { id: 2, name: 'Alex Smith', points: 1100, avatar: 'https://picsum.photos/seed/avatar2/40/40', uid: 'reacher-003' },
    { id: 3, name: 'Emily White', points: 980, avatar: 'https://picsum.photos/seed/avatar3/40/40', uid: 'reacher-004' },
    { id: 4, name: 'Michael Brown', points: 850, avatar: 'https://picsum.photos/seed/avatar4/40/40', uid: 'reacher-005' },
    { id: 5, name: 'Sarah Green', points: 720, avatar: 'https://picsum.photos/seed/avatar5/40/40', uid: 'reacher-006' },
  ];

  export const recentActivities = [
    {
      id: 1,
      user: 'Jane Doe',
      action: 'added a new contact',
      target: 'Peter Jones',
      time: '5m ago',
      avatar: 'https://picsum.photos/seed/avatar1/40/40'
    },
    {
      id: 2,
      user: 'Alex Smith',
      action: 'completed a follow-up with',
      target: 'Mary Williams',
      time: '30m ago',
      avatar: 'https://picsum.photos/seed/avatar2/40/40'
    },
    {
      id: 3,
      user: 'You',
      action: 'scheduled a new follow-up for',
      target: 'David Miller',
      time: '1h ago',
      avatar: 'https://picsum.photos/seed/supervisor/40/40'
    },
    {
      id: 4,
      user: 'Emily White',
      action: 'posted a new devotional',
      target: '"The Power of Prayer"',
      time: '3h ago',
      avatar: 'https://picsum.photos/seed/avatar3/40/40'
    }
  ];

  export type Contact = {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
    dateAdded: string;
  };
  
  export const contacts: Contact[] = [
    { id: 1, name: 'Peter Jones', email: 'peter.j@example.com', phone: '123-456-7890', status: 'New', dateAdded: '2023-06-01' },
    { id: 2, name: 'Mary Williams', email: 'mary.w@example.com', phone: '234-567-8901', status: 'In Progress', dateAdded: '2023-05-28' },
    { id: 3, name: 'David Miller', email: 'david.m@example.com', phone: '345-678-9012', status: 'Contacted', dateAdded: '2023-05-25' },
    { id: 4, name: 'Linda Davis', email: 'linda.d@example.com', phone: '456-789-0123', status: 'New', dateAdded: '2023-06-02' },
  ];
  
  export const followUps: any[] = [
    {
        id: '1',
        contactName: 'Peter Jones',
        contactId: '1',
        contactAvatar: 'https://picsum.photos/seed/1/40/40',
        scheduledFor: '2024-08-15T10:00:00Z',
        message: 'Hey Peter, it was great to meet you! Hope you have a blessed week. How are you finding the book we gave you?',
        status: 'Scheduled',
        creatorId: 'supervisor-001'
    },
    {
        id: '2',
        contactName: 'Mary Williams',
        contactId: '2',
        contactAvatar: 'https://picsum.photos/seed/2/40/40',
        scheduledFor: '2024-07-20T14:30:00Z',
        message: 'Hi Mary! Just checking in to see how you are doing. Let me know if you have any questions or need prayer for anything.',
        status: 'Sent',
        creatorId: 'supervisor-001'
    }
  ];
  
  export type DevotionalPost = {
      id: number;
      title: string;
      author: string;
      authorAvatar?: string;
      image: string;
      imageHint: string;
      content: string;
  };

  export const devotionalPosts: DevotionalPost[] = [
    { id: 1, title: 'Finding Strength in His Word', author: 'John Doe', image: 'https://picsum.photos/seed/devotional1/600/400', imageHint: 'faith journey', content: 'Discover how daily scripture can be your anchor in life\'s storms. Let\'s explore Psalms 46 together and find unshakable hope.' },
    { id: 2, title: 'The Community of Believers', author: 'Jane Doe', image: 'https://picsum.photos/seed/devotional4/600/400', imageHint: 'community fellowship', content: 'We are not meant to walk this path alone. Hebrews 10:24-25 calls us to gather, encourage, and build each other up in faith and love.' },
    { id: 3, title: 'A Heart of Gratitude', author: 'Emily White', image: 'https://picsum.photos/seed/devotional3/600/400', imageHint: 'spiritual growth', content: 'Cultivating gratitude transforms our perspective. Join us in reflecting on 1 Thessalonians 5:18 and the power of giving thanks in all circumstances.' },
  ];

  export const outreachEvents = [
    {
        id: 1,
        title: 'Community Cookout',
        date: 'July 20, 2024',
        location: 'City Park',
        status: 'Planned' as 'Planned' | 'Ongoing' | 'Completed',
        participantIds: ['supervisor-001', 'reacher-002', 'reacher-003'],
        coordinatorId: 'supervisor-001',
        newConverts: [],
    },
    {
        id: 2,
        title: 'Campus Outreach',
        date: 'June 15, 2024',
        location: 'University Plaza',
        status: 'Ongoing' as 'Planned' | 'Ongoing' | 'Completed',
        participantIds: ['supervisor-001', 'reacher-004', 'reacher-005', 'reacher-006'],
        coordinatorId: 'supervisor-001',
        newConverts: [
            { id: 'nc_1', name: 'Chris Evans', phone: '555-0101', status: 'Just Met', assignedTo: 'reacher-004', notes: 'Wants to learn more about small groups.'},
            { id: 'nc_2', name: 'Olivia Garcia', phone: '555-0102', status: 'Follow-up Scheduled', assignedTo: 'reacher-005', notes: 'Invited to Sunday service.'},
            { id: 'nc_3', name: 'James Rodriguez', phone: '555-0103', status: 'Just Met', assignedTo: 'reacher-004', notes: 'Asked for a Bible.'},
            { id: 'nc_4', name: 'Sophia Martinez', phone: '555-0104', status: 'Just Met', assignedTo: 'reacher-006', notes: 'Feeling lost, needs prayer.'},
        ],
    },
    {
        id: 3,
        title: 'Homeless Shelter Visit',
        date: 'May 30, 2024',
        location: 'Downtown Shelter',
        status: 'Completed' as 'Planned' | 'Ongoing' | 'Completed',
        participantIds: ['supervisor-001', 'reacher-002'],
        coordinatorId: 'supervisor-001',
        newConverts: [
             { id: 'nc_5', name: 'Robert Hall', phone: '555-0109', status: 'Contacted', assignedTo: 'reacher-002', notes: 'Gave him a blanket and a meal.'},
             { id: 'nc_6', name: 'Patricia King', phone: '555-0110', status: 'Just Met', assignedTo: 'supervisor-001', notes: 'Prayed with her.'},
        ],
    },
  ];
  

export type UserProfile = {
    uid: string;
    email: string;
    name: string;
    photoURL?: string;
    role: 'Supervisor' | 'Reacher';
};
