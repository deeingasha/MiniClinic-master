import { useState } from 'react';
import { Bell, Menu as MenuIcon, Settings, LogOut, Check, FileText, Clock, Ban, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';

// MUI imports
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

interface AppHeaderProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

export const AppHeader = ({ collapsed, toggleCollapse }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  // Notification menu state
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const notificationsOpen = Boolean(notificationAnchorEl);
  
  // User menu state
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(userAnchorEl);
  
  // Handlers
  const handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleUserMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    handleUserMenuClose();
  };
  
  const handleMarkRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add your mark as read logic here
  };
  
  // Avatar name initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
      <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 hover:bg-primary/10" 
            onClick={toggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <MenuIcon size={20} />
          </Button>
          <div className="flex items-center">
            <h1 className="text-lg font-semibold hidden md:block">Mini Clinic Management</h1>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs ml-2 hidden md:flex items-center">
              <span className="animate-pulse mr-1 h-2 w-2 rounded-full bg-primary"></span>
              Online
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications Button/Badge */}
          <IconButton 
            onClick={handleNotificationClick}
            size="small"
            aria-controls={notificationsOpen ? 'notifications-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={notificationsOpen ? 'true' : undefined}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 bg-background hover:bg-gray-100 dark:hover:bg-gray-800"
            sx={{ 
              padding: '8px',
              borderRadius: '8px',
            }}
          >
            <Badge 
              badgeContent={3} 
              color="error"
              overlap="circular"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.6rem',
                  minWidth: '16px',
                  height: '16px',
                  padding: '0 4px',
                }
              }}
            >
              <Bell size={18} />
            </Badge>
          </IconButton>
          
          {/* Notifications Menu */}
          <Menu
            id="notifications-menu"
            anchorEl={notificationAnchorEl}
            open={notificationsOpen}
            onClose={handleNotificationClose}
            MenuListProps={{
              'aria-labelledby': 'notifications-button',
              sx: { padding: '8px 0' }
            }}
            PaperProps={{
              style: {
                maxHeight: 400,
                width: '340px',
              },
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <div className="px-4 py-2 flex justify-between items-center">
              <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
                Notifications
              </Typography>
              <IconButton size="small" className="text-muted-foreground">
                <MoreHorizontal size={16} />
              </IconButton>
            </div>
            <Divider />
            
            <Typography variant="caption" sx={{ p: 1, pl: 2, display: 'block', color: 'text.secondary', fontWeight: '500' }}>
              Today
            </Typography>
            
            {/* Notification items */}
            <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5, px: 2 }}>
              <div className="flex items-center w-full gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full flex-shrink-0">
                  <FileText size={14} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <Typography variant="body2" sx={{ fontWeight: '500', whiteSpace: 'normal' }}>
                    New patient record created
                  </Typography>
                  <Typography variant="caption" color="text.secondary">30 minutes ago</Typography>
                </div>
                <IconButton size="small" onClick={handleMarkRead} className="text-muted-foreground" sx={{ ml: 1 }}>
                  <Check size={14} />
                </IconButton>
              </div>
            </MenuItem>
            
            <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5, px: 2 }}>
              <div className="flex items-center w-full gap-3">
                <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-full flex-shrink-0">
                  <Clock size={14} className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <Typography variant="body2" sx={{ fontWeight: '500', whiteSpace: 'normal' }}>
                    Appointment reminder
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Dr. Smith in 1 hour</Typography>
                </div>
                <IconButton size="small" onClick={handleMarkRead} className="text-muted-foreground" sx={{ ml: 1 }}>
                  <Check size={14} />
                </IconButton>
              </div>
            </MenuItem>
            
            <Typography variant="caption" sx={{ p: 1, pl: 2, display: 'block', color: 'text.secondary', fontWeight: '500' }}>
              Yesterday
            </Typography>
            
            <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5, px: 2 }}>
              <div className="flex items-center w-full gap-3">
                <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-full flex-shrink-0">
                  <Ban size={14} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <Typography variant="body2" sx={{ fontWeight: '500', whiteSpace: 'normal' }}>
                    Inventory alert
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Low stock on 5 medications</Typography>
                </div>
                <IconButton size="small" onClick={handleMarkRead} className="text-muted-foreground" sx={{ ml: 1 }}>
                  <Check size={14} />
                </IconButton>
              </div>
            </MenuItem>
            
            <Divider />
            <MenuItem 
              onClick={handleNotificationClose} 
              sx={{ 
                justifyContent: 'center', 
                color: 'primary.main',
                fontSize: '0.875rem',
                py: 1.5,
                fontWeight: '500'
              }}
            >
              View all notifications
            </MenuItem>
          </Menu>

          {/* User Profile */}
          <div className="flex items-center space-x-3 ml-2">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium leading-tight">{`${user?.firstName} ${user?.lastName}` || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            
            {/* User Menu Button */}
            <IconButton
              onClick={handleUserMenuClick}
              size="small"
              aria-controls={userMenuOpen ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={userMenuOpen ? 'true' : undefined}
              sx={{ 
                p: 0.5, 
                bgcolor: 'rgba(59, 130, 246, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(59, 130, 246, 0.2)'
                },
                border: '2px solid transparent',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: '#3b82f6',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
              >
                {getInitials(`${user?.firstName} ${user?.lastName}` || 'Admin')}
              </Avatar>
            </IconButton>
            
            {/* User Menu */}
            <Menu
              id="user-menu"
              anchorEl={userAnchorEl}
              open={userMenuOpen}
              onClose={handleUserMenuClose}
              MenuListProps={{
                'aria-labelledby': 'user-button',
                sx: { padding: '8px 0' }
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <div className="px-4 py-2 flex items-center gap-3">
                <Avatar 
                  sx={{ 
                    width: 40,
                    height: 40,
                    bgcolor:'#3b82f6',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  {getInitials(`${user?.firstName} ${user?.lastName}` || 'Admin')}
                </Avatar>
                <div>
                  <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>
                    {`${user?.firstName} ${user?.lastName}` || 'Admin'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.role}
                  </Typography>
                </div>
              </div>
              <Divider sx={{ my: 1 }} />
              
              
              <MenuItem 
                onClick={() => { navigate('/account/password'); handleUserMenuClose(); }}
                sx={{ py: 1.5, px: 2 }}
              >
                <ListItemIcon>
                  <Settings size={18} />
                </ListItemIcon>
                <ListItemText primary="Change Password" />
              </MenuItem>
              
              
              <MenuItem 
                onClick={handleLogout}
                sx={{ color: 'error.main', py: 1.5, px: 2 }}
              >
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <LogOut size={18} />
                </ListItemIcon>
                <ListItemText primary="Log out" />
              </MenuItem>
            </Menu>
          </div>
        </div>
      </header>
  );
};

export default AppHeader;