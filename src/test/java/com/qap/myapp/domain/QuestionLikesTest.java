package com.qap.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.qap.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class QuestionLikesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionLikes.class);
        QuestionLikes questionLikes1 = new QuestionLikes();
        questionLikes1.setId(1L);
        QuestionLikes questionLikes2 = new QuestionLikes();
        questionLikes2.setId(questionLikes1.getId());
        assertThat(questionLikes1).isEqualTo(questionLikes2);
        questionLikes2.setId(2L);
        assertThat(questionLikes1).isNotEqualTo(questionLikes2);
        questionLikes1.setId(null);
        assertThat(questionLikes1).isNotEqualTo(questionLikes2);
    }
}
