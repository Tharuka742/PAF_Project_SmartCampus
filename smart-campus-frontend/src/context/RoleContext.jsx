import { createContext, useContext, useMemo, useState } from 'react';

const RoleContext = createContext(null);

function normalize(role) {
  if (!role) return 'student';
  return String(role).toUpperCase() === 'ADMIN' ? 'admin' : 'student';
}

export function RoleProvider({ children }) {
  const [role, setRoleState] = useState('student');

  const setRole = (next) => {
    setRoleState(normalize(next));
  };

  const value = useMemo(
    () => ({
      role,
      setRole,
      isAdmin: role === 'admin',
      isStudent: role === 'student',
    }),
    [role]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
