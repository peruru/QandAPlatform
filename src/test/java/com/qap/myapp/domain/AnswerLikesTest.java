package com.qap.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.qap.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AnswerLikesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AnswerLikes.class);
        AnswerLikes answerLikes1 = new AnswerLikes();
        answerLikes1.setId(1L);
        AnswerLikes answerLikes2 = new AnswerLikes();
        answerLikes2.setId(answerLikes1.getId());
        assertThat(answerLikes1).isEqualTo(answerLikes2);
        answerLikes2.setId(2L);
        assertThat(answerLikes1).isNotEqualTo(answerLikes2);
        answerLikes1.setId(null);
        assertThat(answerLikes1).isNotEqualTo(answerLikes2);
    }
}
