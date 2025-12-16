// 이메일 형식 검사 - 이메일 형식 준수, 최대 30글자
export const validateEmail = (email: string): boolean => {
  if (email.length > 30) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 비밀번호 유효성 검사 - 8~20글자, 영문 + 숫자 + 특수문자 모두 포함
export const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/;
  return regex.test(password);
};

// 비밀번호 일치 여부 검사
export const validatePasswordMatch = (pwd1: string, pwd2: string): boolean => {
  return pwd1 === pwd2;
};
