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
    { id: 1, name: 'Jane Doe', points: 1250, avatar: 'https://picsum.photos/seed/avatar1/40/40' },
    { id: 2, name: 'Alex Smith', points: 1100, avatar: 'https://picsum.photos/seed/avatar2/40/40' },
    { id: 3, name: 'Emily White', points: 980, avatar: 'https://picsum.photos/seed/avatar3/40/40' },
    { id: 4, name: 'Michael Brown', points: 850, avatar: 'https://picsum.photos/seed/avatar4/40/40' },
    { id: 5, name: 'Sarah Green', points: 720, avatar: 'https://picsum.photos/seed/avatar5/40/40' },
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
      avatar: 'https://picsum.photos/seed/coordinator/40/40'
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
  
  export const followUps = [
    { id: 1, contactName: 'Peter Jones', contactAvatar: 'https://picsum.photos/seed/followup1/40/40', scheduledFor: 'June 15, 2024', message: 'Hey Peter, just checking in to see how you are doing. Hope you have a blessed week!', status: 'Scheduled' },
    { id: 2, contactName: 'Mary Williams', contactAvatar: 'https://picsum.photos/seed/followup2/40/40', scheduledFor: 'June 12, 2024', message: 'Hi Mary, wanted to share a verse that I thought of for you today. Let me know if you want to chat.', status: 'Sent' },
    { id: 3, contactName: 'David Miller', contactAvatar: 'https://picsum.photos/seed/followup3/40/40', scheduledFor: 'June 18, 2024', message: 'David, looking forward to connecting soon. Praying for you!', status: 'Scheduled' },
  ];
  
  export const devotionalPosts = [
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
        participants: [
            { name: 'John Doe', avatar: 'https://picsum.photos/seed/coordinator/40/40' },
            { name: 'Jane Doe', avatar: 'https://picsum.photos/seed/avatar1/40/40' },
            { name: 'Alex Smith', avatar: 'https://picsum.photos/seed/avatar2/40/40' },
        ],
        newConverts: [],
    },
    {
        id: 2,
        title: 'Campus Outreach',
        date: 'June 15, 2024',
        location: 'University Plaza',
        status: 'Ongoing' as 'Planned' | 'Ongoing' | 'Completed',
        participants: [
            { name: 'John Doe', avatar: 'https://picsum.photos/seed/coordinator/40/40' },
            { name: 'Emily White', avatar: 'https://picsum.photos/seed/avatar3/40/40' },
            { name: 'Michael Brown', avatar: 'https://picsum.photos/seed/avatar4/40/40' },
            { name: 'Sarah Green', avatar: 'https://picsum.photos/seed/avatar5/40/40' },
            { name: 'David Miller', avatar: 'https://picsum.photos/seed/avatar6/40/40' },
            { name: 'Linda Davis', avatar: 'https://picsum.photos/seed/avatar7/40/40' },
        ],
        newConverts: [
            { name: 'Chris Evans', phone: '555-0101', status: 'Just Met', assignedTo: 'Emily White', notes: 'Wants to learn more about small groups.'},
            { name: 'Olivia Garcia', phone: '555-0102', status: 'Follow-up Scheduled', assignedTo: 'Michael Brown', notes: 'Invited to Sunday service.'},
            { name: 'James Rodriguez', phone: '555-0103', status: 'Just Met', assignedTo: 'Emily White', notes: 'Asked for a Bible.'},
            { name: 'Sophia Martinez', phone: '555-0104', status: 'Just Met', assignedTo: 'Sarah Green', notes: 'Feeling lost, needs prayer.'},
            { name: 'Benjamin Lee', phone: '555-0105', status: 'Contacted', assignedTo: 'Sarah Green', notes: 'Had a great conversation.'},
            { name: 'Ava Wilson', phone: '555-0106', status: 'Just Met', assignedTo: 'Michael Brown', notes: 'New to the city.'},
            { name: 'Ethan Taylor', phone: '555-0107', status: 'Follow-up Scheduled', assignedTo: 'Emily White', notes: 'Wants to join the welcome team.'},
            { name: 'Mia Anderson', phone: '555-0108', status: 'Contacted', assignedTo: 'Sarah Green', notes: 'Shared her testimony.'},
        ],
    },
    {
        id: 3,
        title: 'Homeless Shelter Visit',
        date: 'May 30, 2024',
        location: 'Downtown Shelter',
        status: 'Completed' as 'Planned' | 'Ongoing' | 'Completed',
        participants: [
            { name: 'John Doe', avatar: 'https://picsum.photos/seed/coordinator/40/40' },
            { name: 'Jane Doe', avatar: 'https://picsum.photos/seed/avatar1/40/40' },
        ],
        newConverts: [
            { name: 'Robert Hall', phone: '555-0109', status: 'Contacted', assignedTo: 'Jane Doe', notes: 'Gave him a blanket and a meal.'},
            { name: 'Patricia King', phone: '555-0110', status: 'Just Met', assignedTo: 'John Doe', notes: 'Prayed with her.'},
            { name: 'Charles Wright', phone: '555-0111', status: 'Just Met', assignedTo: 'Jane Doe', notes: 'Shared a warm coffee.'},
            { name: 'Jessica Hill', phone: '555-0112', status: 'Contacted', assignedTo: 'Jane Doe', notes: 'Needs a new pair of shoes.'},
        ],
    },
  ];
  
