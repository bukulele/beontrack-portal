import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const useUserRoles = () => {
  const [userRoles, setUserRoles] = useState([]);
  const { data: session } = useSession();
  const isRolesSet = useRef(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    const roles = session.userRoles.map((role) => role.id);
    if (roles.length === 0) {
      setUserRoles(["no roles"]);
    } else if (
      !isRolesSet.current ||
      JSON.stringify(userRoles) !== JSON.stringify(roles)
    ) {
      setUserRoles(roles);
      isRolesSet.current = true;
    }
  }, [session]);

  return userRoles;
};

export default useUserRoles;
