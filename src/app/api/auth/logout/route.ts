export const POST = async () => {
  // Supabase Auth logout is handled client-side via supabase.auth.signOut()
  // This endpoint just confirms the action
  return Response.json({ success: true }, { status: 200 });
};
