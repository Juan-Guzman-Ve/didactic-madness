-- ============================================================================
-- RBAC Queries
-- ============================================================================

-- View all roles with policy counts
SELECT 
    r.id,
    r.name,
    r.description,
    COUNT(rp.policy_id) as policy_count
FROM roles r
LEFT JOIN role_policies rp ON r.id = rp.role_id
GROUP BY r.id, r.name, r.description
ORDER BY r.name;

-- View all policies by resource
SELECT 
    resource,
    COUNT(*) as policy_count,
    STRING_AGG(name, ', ' ORDER BY name) as policies
FROM policies
GROUP BY resource
ORDER BY resource;

-- View role-policy mappings
SELECT 
    r.name as role,
    p.name as policy,
    p.resource,
    p.action
FROM role_policies rp
JOIN roles r ON rp.role_id = r.id
JOIN policies p ON rp.policy_id = p.id
ORDER BY r.name, p.resource, p.action;

-- Check user permissions (what can a specific role do?)
SELECT 
    r.name as role,
    p.resource,
    STRING_AGG(p.action, ', ' ORDER BY p.action) as actions
FROM roles r
JOIN role_policies rp ON r.id = rp.role_id
JOIN policies p ON rp.policy_id = p.id
WHERE r.name = 'Customer'  -- Change role name here
GROUP BY r.name, p.resource
ORDER BY p.resource;
