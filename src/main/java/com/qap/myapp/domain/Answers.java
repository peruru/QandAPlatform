package com.qap.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Answers.
 */
@Entity
@Table(name = "answers")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Answers implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "text")
    private String text;

    @JsonIgnoreProperties(value = { "answers", "users" }, allowSetters = true)
    @OneToOne(mappedBy = "answers")
    private AnswerLikes answerLikes;

    @ManyToOne
    @JsonIgnoreProperties(value = { "answers", "companies", "tags", "questionLikes", "users", "subTopic" }, allowSetters = true)
    private Questions questions;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Answers id(Long id) {
        this.id = id;
        return this;
    }

    public String getText() {
        return this.text;
    }

    public Answers text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public AnswerLikes getAnswerLikes() {
        return this.answerLikes;
    }

    public Answers answerLikes(AnswerLikes answerLikes) {
        this.setAnswerLikes(answerLikes);
        return this;
    }

    public void setAnswerLikes(AnswerLikes answerLikes) {
        if (this.answerLikes != null) {
            this.answerLikes.setAnswers(null);
        }
        if (answerLikes != null) {
            answerLikes.setAnswers(this);
        }
        this.answerLikes = answerLikes;
    }

    public Questions getQuestions() {
        return this.questions;
    }

    public Answers questions(Questions questions) {
        this.setQuestions(questions);
        return this;
    }

    public void setQuestions(Questions questions) {
        this.questions = questions;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Answers)) {
            return false;
        }
        return id != null && id.equals(((Answers) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Answers{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            "}";
    }
}
