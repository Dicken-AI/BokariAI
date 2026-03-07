/**
 * Map Supabase snake_case DB rows to camelCase for frontend compatibility
 */

export function mapChat(row: any) {
  if (!row) return row;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    createdAt: row.created_at,
    sources: row.sources || [],
    files: row.files || [],
  };
}

export function mapMessage(row: any) {
  if (!row) return row;
  return {
    id: row.id,
    messageId: row.message_id,
    chatId: row.chat_id,
    backendId: row.backend_id,
    query: row.query,
    createdAt: row.created_at,
    responseBlocks: row.response_blocks || [],
    status: row.status,
  };
}

export function mapChats(rows: any[]) {
  return (rows || []).map(mapChat);
}

export function mapMessages(rows: any[]) {
  return (rows || []).map(mapMessage);
}
