export const CurrentUserQueryKey = ["user", "me"];
export const GetUserDetailQueryKey = userId => ["user", userId];
export const SearchMenteesQueryKey = query => ["searchMentees", query];
export const SearchAllUsersByEmailQueryKey = query => [
  "searchAllUsersByEmail",
  query,
];
