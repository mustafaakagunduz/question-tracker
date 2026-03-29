import { Question, ReviewStatus } from '../types';
import { getSupabaseClient } from './supabaseClient';
const getClient = () => getSupabaseClient() as any;

type QuestionRow = {
  id: number;
  title: string;
  site: string;
  link: string;
  solved_date: string | null;
  difficulty: string;
  review_date: string | null;
};

const mapRowToQuestion = (row: QuestionRow): Question => ({
  id: row.id,
  title: row.title,
  site: row.site,
  link: row.link,
  solvedDate: row.solved_date ? new Date(row.solved_date) : null,
  difficulty: row.difficulty,
  reviewDate: row.review_date ? new Date(row.review_date) : null,
});

const toDateOnly = (date: Date | null): string | null => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const fetchQuestions = async (): Promise<Question[]> => {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('questions')
    .select('id, title, site, link, solved_date, difficulty, review_date');

  if (error) throw error;

  return (data ?? []).map((row: any) => mapRowToQuestion(row as QuestionRow));
};

export const createQuestion = async (question: Omit<Question, 'id'>): Promise<Question> => {
  const supabase = getClient();
  const payload = {
    title: question.title,
    site: question.site,
    link: question.link,
    solved_date: toDateOnly(question.solvedDate),
    difficulty: question.difficulty,
    review_date: toDateOnly(question.reviewDate),
  };

  const { data, error } = await supabase
    .from('questions')
    .insert(payload)
    .select('id, title, site, link, solved_date, difficulty, review_date')
    .single();

  if (error) throw error;

  return mapRowToQuestion(data as QuestionRow);
};

export const updateQuestion = async (question: Question): Promise<Question> => {
  const supabase = getClient();
  const payload = {
    title: question.title,
    site: question.site,
    link: question.link,
    solved_date: toDateOnly(question.solvedDate),
    difficulty: question.difficulty,
    review_date: toDateOnly(question.reviewDate),
  };

  const { data, error } = await supabase
    .from('questions')
    .update(payload)
    .eq('id', question.id)
    .select('id, title, site, link, solved_date, difficulty, review_date')
    .single();

  if (error) throw error;

  return mapRowToQuestion(data as QuestionRow);
};

export const removeQuestion = async (id: number): Promise<void> => {
  const supabase = getClient();
  const { error } = await supabase.from('questions').delete().eq('id', id);
  if (error) throw error;
};

export const fetchReviewStatusForDate = async (
  questionIds: number[],
  reviewDate: string
): Promise<ReviewStatus> => {
  const supabase = getClient();
  if (questionIds.length === 0) return {};

  const { data, error } = await supabase
    .from('question_review_status')
    .select('question_id, is_reviewed')
    .eq('review_date', reviewDate)
    .in('question_id', questionIds);

  if (error) throw error;

  const status: ReviewStatus = {};

  for (const row of (data ?? []) as any[]) {
    status[row.question_id as number] = Boolean(row.is_reviewed);
  }

  return status;
};

export const setReviewStatusForDate = async (
  questionId: number,
  reviewDate: string,
  isReviewed: boolean
): Promise<void> => {
  const supabase = getClient();
  const { error } = await supabase
    .from('question_review_status')
    .upsert(
      ({
        question_id: questionId,
        review_date: reviewDate,
        is_reviewed: isReviewed,
      }),
      { onConflict: 'question_id,review_date' }
    );

  if (error) throw error;
};
